import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dibujar, dibujarGrupo } from './figuras.ts';
import { adentro, camara, contorno, dibujarRecinto, dibujarSuelo, punto, simbolos, type Bestiario } from './mapa.ts';
import { existsSync } from 'node:fs';
import { lobo, cordero, pierre, retrato } from './titeres.ts';
import { escenaMonte, VECINOS_DEL_MONTE } from './escena-monte.ts';
import {
  CHORRO, escenaBajo, escenaBaldio, escenaInfierno, escenaTemplo, VECINOS_DEL_BAJO, VECINOS_DEL_BALDIO, VECINOS_DEL_INFIERNO, VECINOS_DEL_TEMPLO,
} from './escenas.ts';
import { ACECHO, BAJO, PASTURA, ESCENA, PALO, PIERRE, PIERRE_ARMADO } from './rig.ts';
import { ARMADO, RECORTES, cajaDeRecorte, LADO_TAPA } from './recortes.ts';
import { PIEZAS } from './arte.ts';
import { ETIQUETA, PIEZAS_BAJO, PIEZAS_PIERRE, PUERTA, agujero } from './arte-bajo.ts';
import { pincelada } from './pincel.ts';
import { ENTORNOS, PIEZAS_ENTORNOS, luzQueAsoma } from './arte-entornos.ts';
import { ENTORNOS_DE_NOCHE, QUIENES } from './escenas-entornos.ts';
import { ALTO as ALTO_ENTORNO, ANCHO as ANCHO_ENTORNO, FIERROS, RUTA } from './rig-entornos.ts';

/**
 * El bestiario redondo (`D-73`), probado contra lo único que no puede fallar.
 *
 * `CLAUDE.md` deja una sola cosa estricta en todo el sitio: que lo que se presenta como dato
 * sea correcto, porque si no el sitio le marca error al que se sabe el tema. En el bestiario
 * el dato es **el verso**: cada bestia dice en qué tema sale y con qué palabras. Si ese
 * verso no está en la letra, la ficha miente. Este archivo lo coteja contra
 * `cancionero.json`, verso por verso, sin tildes ni signos (la transcripción del cancionero
 * no siempre los trae), pero con las palabras enteras y en orden.
 *
 * Lo demás es la forma del mundo: que nadie viva fuera de su región, que el monte no se
 * meta en la pastura, que cada "anda cerca" lleve a alguien que existe.
 */

const leer = (ruta: string): unknown => JSON.parse(readFileSync(ruta, 'utf-8'));
const datos = leer('src/data/bestiario.json') as Bestiario & { bestias: Bestiario['bestias'] };

interface Cancionero {
  temas: Array<{ slug: string; secciones: Array<{ lineas: Array<{ t: string; texto: string }> }> }>;
}
const cancionero = leer('src/data/cancionero.json') as Cancionero;
const redondopedia = leer('src/data/redondopedia.json') as { articulos: Array<{ slug: string }> };

/** Sin tildes, sin signos, en minúscula, con un espacio entre palabra y palabra. */
export const normalizar = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const letras = new Map(
  cancionero.temas.map((t) => [
    t.slug,
    ` ${normalizar(t.secciones.flatMap((s) => s.lineas).filter((l) => l.t === 'letra').map((l) => l.texto).join(' '))} `,
  ]),
);

/** Los versos que no están en la letra del tema que dicen. Vacío es bien. */
export function versosQueNoEstan(tema: string, versos: readonly string[], fuente = letras): string[] {
  const letra = fuente.get(tema);
  if (letra === undefined) return [`el tema "${tema}" no está en el cancionero`];
  return versos.filter((v) => !letra.includes(` ${normalizar(v)} `));
}

test('cada verso del bestiario está en la letra del tema que dice', () => {
  const malos: string[] = [];
  for (const b of datos.bestias) {
    const citas = [...(b.tema ? [{ tema: b.tema, verso: b.verso ?? [] }] : []), ...(b.tambien ?? [])];
    for (const c of citas) for (const v of versosQueNoEstan(c.tema, c.verso)) malos.push(`${b.id} (${c.tema}): ${v}`);
  }
  assert.deepEqual(malos, []);
});

test('ese cotejo sabe encontrar: un verso cambiado, una palabra de más o un tema que no existe', () => {
  const falsa = new Map([['tema', ` ${normalizar('Como se ríe el gordo Pierre / y rompió el vidrio el gordo Pierre')} `]]);
  assert.deepEqual(versosQueNoEstan('tema', ['y rompió el vidrio'], falsa), []);
  assert.deepEqual(versosQueNoEstan('tema', ['y rompió la puerta'], falsa), ['y rompió la puerta']);
  // Una palabra cortada no pasa por estar adentro de otra: "rie" no es "ríe el gordo".
  assert.deepEqual(versosQueNoEstan('tema', ['ie el gordo'], falsa), ['ie el gordo']);
  assert.equal(versosQueNoEstan('otro', ['lo que sea'], falsa).length, 1);
});

test('las que no salen en ninguna letra son las del mito, y lo que cuentan va rotulado', () => {
  const sinTema = datos.bestias.filter((b) => !b.tema).map((b) => b.id);
  assert.deepEqual(sinTema.sort(), ['patricio-rey', 'redonditos-de-ricota']);
  for (const id of sinTema) {
    const b = datos.bestias.find((x) => x.id === id)!;
    assert.ok(b.cuenta && b.cuenta.length > 0, `${id} no sale en ninguna letra y no cuenta de dónde sale`);
  }
});

test('ningún id se repite, y cada "anda cerca" lleva a una bestia que existe y no es ella misma', () => {
  const ids = datos.bestias.map((b) => b.id);
  assert.equal(new Set(ids).size, ids.length);
  const malos = datos.bestias.flatMap((b) =>
    b.cerca.filter((c) => c === b.id || !ids.includes(c)).map((c) => `${b.id} → ${c}`),
  );
  assert.deepEqual(malos, []);
});

test('cada región tiene quien la habite, y sus vecinas existen', () => {
  const regiones = datos.regiones.map((r) => r.id);
  for (const r of datos.regiones) {
    assert.ok(datos.bestias.some((b) => b.region === r.id), `${r.id} está vacía`);
    for (const v of r.vecinas) assert.ok(regiones.includes(v) && v !== r.id, `${r.id} tiene una vecina rara: ${v}`);
  }
  for (const b of datos.bestias) assert.ok(regiones.includes(b.region), `${b.id} vive en una región que no existe`);
});

test('nadie vive fuera de su región: el monte rodea la pastura y no se mete en ella', () => {
  const region = new Map(datos.regiones.map((r) => [r.id, r]));
  const claro = datos.regiones.find((r) => r.forma.tipo === 'claro')!;
  const galpon = datos.regiones.find((r) => r.forma.tipo === 'centro')!;
  const malos: string[] = [];
  for (const b of datos.bestias) {
    const p = punto(b.pos);
    if (!adentro(region.get(b.region)!.forma, p)) malos.push(`${b.id} cae fuera de ${b.region}`);
    if (b.region !== claro.id && adentro(claro.forma, p)) malos.push(`${b.id} se metió en la pastura`);
    if (b.region !== galpon.id && adentro(galpon.forma, p)) malos.push(`${b.id} se metió en el galpón`);
  }
  assert.deepEqual(malos, []);
});

test('el lobo suelto acecha en el borde de la pastura, y el cordero está atado adentro', () => {
  // El pedido que armó el mapa: el cordero atado a un palo, y el lobo cerca, en otro entorno.
  const claro = datos.regiones.find((r) => r.id === 'la-pastura')!;
  if (claro.forma.tipo !== 'claro') throw new Error('la pastura dejó de ser un claro');
  const c = { ...punto({ ang: claro.forma.angulo, r: claro.forma.distancia }) };
  const lobo = punto(datos.bestias.find((b) => b.id === 'el-lobo-suelto')!.pos);
  const cordero = punto(datos.bestias.find((b) => b.id === 'el-cordero-atado')!.pos);
  const aLobo = Math.hypot(lobo.x - c.x, lobo.y - c.y);
  assert.ok(Math.hypot(cordero.x - c.x, cordero.y - c.y) < 30, 'el cordero se alejó del palo más que la soga');
  assert.ok(aLobo > claro.forma.radio && aLobo < claro.forma.radio + 20, `el lobo está a ${Math.round(aLobo)}: lejos del borde`);
});

test('lo que se nombra como artículo de la Redondopedia existe', () => {
  const slugs = new Set(redondopedia.articulos.map((a) => a.slug));
  const malos = datos.bestias.filter((b) => b.articulo && !slugs.has(b.articulo)).map((b) => `${b.id} → ${b.articulo}`);
  assert.deepEqual(malos, []);
});

test('cada figura se dibuja, y el mapa entero sale sin un número roto', () => {
  for (const b of datos.bestias) {
    assert.doesNotThrow(() => dibujar(b.dibujo), b.id);
    assert.doesNotThrow(() => dibujarGrupo(b.dibujo, b.cantidad ?? 1), b.id);
  }
  const todo = simbolos(datos.bestias) + dibujarSuelo(datos) + datos.regiones.map((r) => contorno(r.forma)).join('');
  assert.ok(!/NaN|undefined|Infinity/.test(todo), 'hay un número roto en el SVG');
  for (const r of datos.regiones) {
    const c = camara(r, datos.bestias);
    assert.ok(c.lado > 100 && c.lado <= 1000 && Number.isFinite(c.x + c.y), `la cámara de ${r.id} no sirve`);
  }
});

test('ni un hex en el bestiario: los colores son clases que pinta sitio.css', () => {
  const fuentes = [
    'src/lib/bestiario/figuras.ts', 'src/lib/bestiario/mapa.ts', 'src/lib/bestiario/titeres.ts', 'src/lib/bestiario/escena-monte.ts',
    'src/lib/bestiario/escenas.ts', 'src/lib/bestiario/rig.ts', 'src/lib/bestiario/arte-bajo.ts', 'src/lib/bestiario/pincel.ts',
    'src/lib/bestiario/arte-entornos.ts', 'src/lib/bestiario/escenas-entornos.ts', 'src/lib/bestiario/rig-entornos.ts',
    'src/scripts/bestiario.ts', 'src/data/bestiario.json',
  ];
  const malos = fuentes.filter((f) => /#[0-9a-fA-F]{3,8}\b(?![-\w])/.test(readFileSync(f, 'utf-8').replace(/href="#fig-|#fig-|`#\$\{|'#b-|#b-|#region-/g, '')));
  assert.deepEqual(malos, []);
});

/*
 * La segunda vuelta: el zoológico, con el lobo y el cordero de Rocambole como títeres.
 */

test('el lobo y el cordero son las tapas: cada pieza que mueve la isla es un recorte, y cada ojo tiene su párpado', () => {
  for (const [nombre, marcado, piezas] of [
    ['lobo', lobo(), ['pecho', 'cabeza']],
    ['cordero', cordero(), ['pata-tras', 'pata-del', 'cuerpo', 'cabeza']],
  ] as const) {
    for (const parte of [...piezas, 'parpado-1', 'parpado-2']) {
      assert.ok(marcado.includes(`data-parte="${parte}"`), `al ${nombre} le falta ${parte}`);
    }
    // Lo que se ve del títere sale de las tapas: cada imagen es un recorte, salvo el lomo.
    const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]);
    assert.deepEqual(imagenes.filter((n) => !n!.includes('-real-') && n !== 'cordero-lomo'), [], `el ${nombre} tiene piezas que no son de la tapa`);
    for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  }
});

test('cada recorte cae adentro de la tapa, y cada pivote adentro de su pieza', () => {
  for (const r of RECORTES) {
    for (const [x, y] of r.poligono) assert.ok(x >= 0 && x <= LADO_TAPA && y >= 0 && y <= LADO_TAPA, `${r.nombre}: un punto se sale de la tapa`);
    const [x, y, ancho, alto] = cajaDeRecorte(r);
    assert.ok(ancho > 10 && alto > 10 && x + ancho <= LADO_TAPA && y + alto <= LADO_TAPA, `${r.nombre}: caja rara`);
  }
  const dentro = (nombre: string, [px, py]: readonly [number, number]): boolean => {
    const [x, y, ancho, alto] = cajaDeRecorte(RECORTES.find((r) => r.nombre === nombre)!);
    return px >= x && px <= x + ancho && py >= y && py <= y + alto;
  };
  assert.ok(dentro('lobo-real-cabeza', ARMADO.lobo.cabeza));
  assert.ok(dentro('cordero-real-cabeza', ARMADO.cordero.cabeza));
  assert.ok(dentro('cordero-real-pata-tras', ARMADO.cordero['pata-tras']));
  assert.ok(dentro('cordero-real-pata-del', ARMADO.cordero['pata-del']));
});

test('la escena del monte sale entera, y nadie del monte ni de la pastura queda afuera de su recinto', () => {
  const escena = escenaMonte(new Map(datos.bestias.map((b) => [b.id, b.nombre])));
  assert.ok(!/NaN|undefined|Infinity/.test(escena), 'hay un número roto en la escena del monte');
  const titeres = ['el-lobo-suelto', 'el-cordero-atado'];
  const delRecinto = datos.bestias.filter((b) => b.region === 'el-monte' || b.region === 'la-pastura').map((b) => b.id);
  const puestos = [...titeres, ...Object.keys(VECINOS_DEL_MONTE)];
  assert.deepEqual([...delRecinto].sort(), [...puestos].sort());
  for (const [id, [x, y]] of Object.entries(VECINOS_DEL_MONTE)) {
    assert.ok(x >= 0 && x <= ESCENA.ancho && y >= 0 && y <= ESCENA.alto, `${id} quedó afuera de la escena`);
  }
});

test('el lobo acecha detrás de la pastura, adentro de la escena, y cuando se hunde no se ve', () => {
  assert.ok(ACECHO.desde > 60 && ACECHO.hasta < ESCENA.ancho - 60, 'el lobo se sale por los costados');
  // El piso del busto queda escondido detrás del borde del piso (y = 300) y atrás del palo:
  // asoma por detrás de la pastura, nunca adelante del cordero.
  assert.ok(ACECHO.piso > 300 && ACECHO.piso < PALO.y - PASTURA.ry + 60);
  // Hundido, la punta de las orejas (el borde de arriba de la cabeza) queda abajo del borde del piso (y = 300).
  const orejas = ACECHO.piso + ACECHO.hundido - (ARMADO.lobo.piso[1] - 0) * 0.2;
  assert.ok(orejas > 300, `hundido, el lobo asoma las orejas en y = ${orejas}`);
});

test('cada recinto genérico sale sin números rotos', () => {
  for (const r of datos.regiones) {
    if (r.forma.tipo === 'anillo' || r.id === 'el-monte' || r.id === 'la-pastura') continue;
    const { svg } = dibujarRecinto(r, datos);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `el recinto ${r.id} tiene un número roto`);
  }
});

test('cada pieza del aerógrafo y cada recorte están en public/bestiario', () => {
  // Las imprime `node --experimental-strip-types scripts/imprimir-bestiario.mjs`. Una pieza
  // que la página pide y no está impresa es un agujero en el monte.
  // Los recortes de las tapas los hace `scripts/recortar-bestiario.mjs`.
  const nombres = [...PIEZAS.map((p) => p.nombre), ...RECORTES.map((r) => r.nombre)];
  const faltan = nombres.filter((n) => !existsSync(`public/bestiario/${n}.webp`));
  assert.deepEqual(faltan, []);
  const piden = [...(lobo() + cordero() + escenaMonte(new Map()) + escenaBajo(new Map())).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]);
  assert.ok(piden.length > 10);
  assert.deepEqual(piden.filter((n) => !nombres.includes(n!)), []);
});

test('cada recinto de noche tiene a todos los suyos: el protagonista de tapa y los demás como ojos', () => {
  const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
  for (const [region, protagonista, vecinos, escena] of [
    ['los-techos', 'ese-perro-que-sigue-alli', VECINOS_DEL_BALDIO, escenaBaldio(nombres)],
    ['el-infierno', 'luzbelito', VECINOS_DEL_INFIERNO, escenaInfierno(nombres)],
    ['el-templo', 'momo', VECINOS_DEL_TEMPLO, escenaTemplo(nombres)],
  ] as const) {
    const delRecinto = datos.bestias.filter((b) => b.region === region).map((b) => b.id).sort();
    assert.deepEqual(delRecinto, [protagonista, ...Object.keys(vecinos)].sort(), `en ${region} falta o sobra alguien`);
    assert.ok(escena.includes(`data-id="${protagonista}"`), `${region} no tiene a su protagonista`);
    assert.ok(!/NaN|undefined|Infinity/.test(escena), `${region} tiene un número roto`);
    for (const [id, [x, y]] of Object.entries(vecinos)) assert.ok(x >= 0 && x <= ESCENA.ancho && y >= 0 && y <= ESCENA.alto, `${id} se sale`);
    // El protagonista es de la tapa: sus imágenes son recortes.
    const imagenes = [...escena.matchAll(/href="\/bestiario\/([a-z0-9-]+-real-[a-z0-9-]+)\.webp"/g)];
    assert.ok(imagenes.length > 0, `${region}: el protagonista no es un recorte de la tapa`);
  }
});

test('los cinco de tapa tienen retrato de ficha, encuadrado en sus piezas; los demás siguen con su figura', () => {
  // Pierre no es de tapa pero tiene títere: su ficha también lo muestra como en la escena.
  const dePierre = retrato('el-gordo-pierre');
  assert.ok(dePierre && dePierre.svg.includes('pierre-cabeza') && !/NaN/.test(dePierre.caja));
  for (const id of ['el-lobo-suelto', 'el-cordero-atado', 'ese-perro-que-sigue-alli', 'luzbelito', 'momo']) {
    assert.ok(datos.bestias.some((b) => b.id === id), `${id} no está en el bestiario`);
    const r = retrato(id);
    assert.ok(r, `${id} no tiene retrato`);
    const [, , ancho, alto] = r.caja.split(' ').map(Number);
    assert.ok(ancho! > 50 && alto! > 50 && !/NaN/.test(r.caja), `${id}: caja rota (${r.caja})`);
    assert.ok(r.svg.includes('-real-'), `${id}: el retrato no es la tapa`);
  }
  assert.equal(retrato('la-mosca'), null);
});

/*
 * La sexta vuelta: el bajo inundado y el gordo Pierre, pintado a pincel seco en la estética de
 * *Gulp!* (`arte-bajo.ts`, `pincel.ts`).
 */

/** Todo lo que un archivo importa, de punta a punta, siguiendo los caminos relativos. */
function importados(desde: string): string[] {
  const vistos = new Set<string>();
  const pendientes = [desde];
  while (pendientes.length) {
    const archivo = pendientes.pop()!;
    if (vistos.has(archivo)) continue;
    vistos.add(archivo);
    const carpeta = archivo.slice(0, archivo.lastIndexOf('/'));
    for (const m of readFileSync(archivo, 'utf-8').matchAll(/(?:^|\n)\s*(?:import|export)[^'"]*?from\s+'(\.[^']+)'/g)) {
      const ruta: string[] = [];
      for (const p of `${carpeta}/${m[1]}`.split('/')) {
        if (p === '..') ruta.pop();
        else if (p !== '.') ruta.push(p);
      }
      pendientes.push(ruta.join('/'));
    }
  }
  return [...vistos].map((r) => r.slice(r.lastIndexOf('/') + 1));
}

test('la isla se lleva números: no importa nada que dibuje', () => {
  // Si la isla importa un módulo que dibuja, el teléfono corre el aerógrafo entero al abrir la
  // página para no usarlo. Pasó en la quinta vuelta: `escenas.ts` arrastraba `arte.ts`.
  const dibujan = ['arte.ts', 'arte-bajo.ts', 'arte-entornos.ts', 'aerografo.ts', 'pincel.ts', 'escenas.ts', 'escenas-entornos.ts', 'escena-monte.ts', 'titeres.ts', 'figuras.ts', 'mapa.ts'];
  const llevados = importados('src/scripts/bestiario.ts');
  assert.ok(llevados.includes('rig.ts'), 'la isla dejó de leer rig.ts: el censo no está mirando bien');
  assert.deepEqual(llevados.filter((n) => dibujan.includes(n)), [], `la isla se lleva al teléfono: ${llevados.join(', ')}`);
  // Y el censo sabe encontrar: desde las escenas, que sí dibujan, llega al aerógrafo.
  assert.ok(importados('src/lib/bestiario/escenas.ts').includes('aerografo.ts'));
});

test('el gordo Pierre es un títere entero: cada pieza que mueve la isla, con su imagen y su pivote', () => {
  const marcado = pierre();
  for (const parte of ['cuerpo', 'cabeza', 'mandibula', 'brazo', 'antebrazo', 'parpado-1', 'parpado-2']) {
    assert.ok(marcado.includes(`data-parte="${parte}"`), `a Pierre le falta ${parte}`);
  }
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_PIERRE.map((p) => p.nombre).sort(), 'Pierre usa piezas que no se imprimen, o le sobra una');
  const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PIERRE.find((p) => p.nombre === nombre)!.caja;
  const adentro = (nombre: string, [x, y]: readonly [number, number]): boolean => {
    const [x0, y0, ancho, alto] = caja(nombre);
    return x >= x0 && x <= x0 + ancho && y >= y0 && y <= y0 + alto;
  };
  assert.ok(adentro('pierre-cuerpo', PIERRE_ARMADO.cuello) && adentro('pierre-mandibula', PIERRE_ARMADO.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('pierre-brazo', PIERRE_ARMADO.hombro) && adentro('pierre-cuerpo', PIERRE_ARMADO.hombro), 'el hombro no está en el hombro');
  assert.ok(adentro('pierre-brazo', PIERRE_ARMADO.codo) && adentro('pierre-antebrazo', PIERRE_ARMADO.codo), 'el codo no une las dos mitades del brazo');
  assert.ok(adentro('pierre-antebrazo', PIERRE_ARMADO.pico), 'el pico de la botella no está en la botella');
  for (const o of PIERRE_ARMADO.ojos) assert.ok(adentro('pierre-cabeza', o.centro) && adentro('pierre-cabeza', o.parpado), 'un ojo se salió de la cara');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
});

test('cuando se empina la botella, el pico le llega a la boca', () => {
  // El trago no es decoración: si el brazo gira y la botella queda en la oreja, se ve mal hecho.
  const girar = ([x, y]: readonly [number, number], [cx, cy]: readonly [number, number], grados: number): [number, number] => {
    const a = (grados * Math.PI) / 180;
    return [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
  };
  const { hombro, codo, pico, boca, trago } = PIERRE_ARMADO;
  // El antebrazo gira en el codo y, encima, el brazo entero en el hombro.
  const tope = girar(girar(pico, codo, trago.antebrazo), hombro, trago.brazo);
  const lejos = Math.hypot(tope[0] - boca[0], tope[1] - boca[1]);
  assert.ok(lejos < 30, `el pico queda a ${Math.round(lejos)} de la boca`);
});

test('el bajo tiene a todos los suyos, y Pierre está en el agua, entre la pared y el que mira', () => {
  const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
  const escena = escenaBajo(nombres);
  const delRecinto = datos.bestias.filter((b) => b.region === 'el-bajo').map((b) => b.id).sort();
  assert.deepEqual(delRecinto, ['el-gordo-pierre', ...Object.keys(VECINOS_DEL_BAJO)].sort());
  assert.ok(!/NaN|undefined|Infinity/.test(escena), 'el bajo tiene un número roto');
  assert.equal(escena.match(/id="pierre-entero"/g)?.length, 1, 'el reflejo copia a Pierre por su id, que tiene que ser uno solo');
  assert.ok(escena.includes('href="#pierre-entero"'), 'Pierre no tiene reflejo');
  for (const [id, [x, y]] of Object.entries(VECINOS_DEL_BAJO)) assert.ok(x >= 0 && x <= ESCENA.ancho && y >= 0 && y <= ESCENA.alto, `${id} se sale`);
  assert.ok(PIERRE.agua > BAJO.fondo && PIERRE.agua < ESCENA.alto - 60, 'Pierre no está metido en el agua');
  assert.ok(escena.includes(`<rect x="-10" y="${PIERRE.agua}"`), 'el agua de adelante no lo corta donde lo toca');
  // El agujero está en el vidrio de la puerta, y el agua que entra cae hasta el agua.
  for (const [x, y] of agujero()) {
    const [vx0, vy0, vx1, vy1] = PUERTA.vidrio;
    assert.ok(x > vx0 && x < vx1 && y > vy0 && y < vy1, 'el vidrio está roto afuera del vidrio');
  }
  for (const [dx0, dy0] of CHORRO) assert.ok(Math.hypot(dx0, dy0) < 60, 'un hilo de agua no sale del agujero');
});

test('lo único de Pierre que sale de una tapa es la etiqueta, y la tapa existe', () => {
  const tapas = PIEZAS_PIERRE.flatMap((p) => [...p.dibujo.matchAll(/href="tapa:([a-z0-9-]+)"/g)].map((m) => `${p.nombre} ← ${m[1]}`));
  assert.deepEqual(tapas, ['pierre-antebrazo ← gulp-trasera']);
  for (const p of PIEZAS) for (const m of p.dibujo.matchAll(/href="tapa:([a-z0-9-]+)"/g)) {
    assert.ok(existsSync(`Docs/INVESTIGACION/TapasDiscos/${m[1]}.jpg`), `${p.nombre} pide una tapa que no está: ${m[1]}`);
  }
  // La etiqueta es el papelito del «gulp.» de la contratapa: un cuadrilátero adentro de ella.
  for (const [x, y] of ETIQUETA) assert.ok(x > 0 && x < 953 && y > 0 && y < 750);
});

test('el pincel seco sale igual en cada impresión, y no rompe ningún número', () => {
  const una = pincelada([[0, 0], [40, -10], [80, 10], [120, 0]], { ancho: 20, seco: 0.4 }, 7);
  assert.equal(una, pincelada([[0, 0], [40, -10], [80, 10], [120, 0]], { ancho: 20, seco: 0.4 }, 7));
  assert.notEqual(una, pincelada([[0, 0], [40, -10], [80, 10], [120, 0]], { ancho: 20, seco: 0.4 }, 8));
  assert.ok(una.length > 200 && !/NaN|undefined|Infinity/.test(una));
  // Seco a fondo deja más papel: menos tinta que la misma pasada cargada.
  const cargada = pincelada([[0, 0], [40, -10], [80, 10], [120, 0]], { ancho: 20, seco: 0 }, 7);
  const seca = pincelada([[0, 0], [40, -10], [80, 10], [120, 0]], { ancho: 20, seco: 1 }, 7);
  const tinta = (s: string): number => [...s.matchAll(/[ML]/g)].length;
  assert.ok(tinta(seca) < tinta(cargada), 'el pincel seco no se seca');
  for (const p of PIEZAS_BAJO) assert.ok(!/NaN|undefined|Infinity/.test(p.dibujo), `${p.nombre} tiene un número roto`);
});

/*
 * La octava vuelta: los seis entornos que seguían con las figuras del plano, cada uno en la tapa
 * de su disco (`arte-entornos.ts`, `escenas-entornos.ts`, `rig-entornos.ts`).
 */

test('cada entorno de noche tiene a todos los suyos, y nadie se sale de la escena', () => {
  const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
  for (const [region, { escena }] of Object.entries(ENTORNOS_DE_NOCHE)) {
    const delRecinto = datos.bestias.filter((b) => b.region === region).map((b) => b.id).sort();
    assert.deepEqual([...QUIENES[region]!].sort(), delRecinto, `en ${region} falta o sobra alguien`);
    const marcado = escena(nombres);
    assert.ok(!/NaN|undefined|Infinity/.test(marcado), `${region} tiene un número roto`);
    for (const id of delRecinto) assert.ok(marcado.includes(`data-id="${id}"`), `${region}: ${id} no se puede tocar`);
    for (const m of marcado.matchAll(/data-x="(-?[\d.]+)" data-y="(-?[\d.]+)"/g)) {
      const [x, y] = [Number(m[1]), Number(m[2])];
      assert.ok(x >= 0 && x <= ANCHO_ENTORNO && y >= 0 && y <= ALTO_ENTORNO, `${region}: alguien quedó afuera, en (${x}, ${y})`);
    }
  }
});

test('cada pieza que piden los seis entornos está impresa en public/bestiario', () => {
  const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
  const impresas = PIEZAS_ENTORNOS.map((p) => p.nombre);
  for (const { escena } of Object.values(ENTORNOS_DE_NOCHE)) {
    const piden = [...escena(nombres).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
    assert.ok(piden.length >= 3);
    assert.deepEqual(piden.filter((n) => !impresas.includes(n) || !existsSync(`public/bestiario/${n}.webp`)), []);
  }
});

test('los entornos se pueden pintar más anchos, para el camino, sin un número roto', () => {
  // El camino (`camino.ts`) pide las mismas capas a lo ancho de un tramo: lo lejano a 1850, el
  // piso a 2400 y lo de adelante a 3036 (`anchoDeCapa`). Acá no se imprimen; se arman.
  for (const [region, capas] of Object.entries(ENTORNOS)) {
    for (const [capa, pintar] of Object.entries(capas)) {
      const ancho = capa === 'lejos' ? 1850 : capa === 'frente' ? 3036 : 2400;
      const dibujo = (pintar as (ancho?: number) => string)(ancho);
      assert.ok(dibujo.length > 500 && !/NaN|undefined|Infinity/.test(dibujo), `${region}, ${capa} a ${ancho}: número roto`);
    }
    assert.ok(luzQueAsoma(region, 100, 300).includes('<ellipse'), `${region} no tiene luz que asome`);
  }
  assert.equal(luzQueAsoma('una-region-que-no-existe', 0, 0), '');
});

test('los fierros de la ruta pasan por su carril, con las ruedas adentro de su imagen', () => {
  for (const [id, { pieza, carril, caja, x }] of Object.entries(FIERROS)) {
    assert.ok(datos.bestias.some((b) => b.id === id && b.region === 'la-ruta'), `${id} no es de la ruta`);
    const [cx, cy, w, h] = caja;
    assert.ok(cx < 0 && cx + w > 0 && cy < 0 && cy + h > 0, `${id}: el (0, 0) de las ruedas no cae en su imagen`);
    assert.ok(RUTA.carriles[carril]! > RUTA.asfalto.arriba && RUTA.carriles[carril]! < RUTA.asfalto.abajo, `${id}: el carril no está en el asfalto`);
    assert.ok(x >= 0 && x <= ANCHO_ENTORNO);
    assert.ok(existsSync(`public/bestiario/${pieza}.webp`), `${pieza} no está impresa`);
  }
});
