import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dibujar, dibujarGrupo } from './figuras.ts';
import { adentro, camara, contorno, dibujarRecinto, dibujarRuta, dibujarSuelo, punto, simbolos, type Bestiario } from './mapa.ts';
import { existsSync } from 'node:fs';
import { lobo, cordero, dracula, pierre, retrato } from './titeres.ts';
import { escenaMonte, VECINOS_DEL_MONTE } from './escena-monte.ts';
import {
  CHORRO, JAULA_VACIA, escenaBajo, escenaBaldio, escenaInfierno, escenaPrision, escenaTemplo, VECINOS_DE_LA_PRISION, VECINOS_DEL_BAJO, VECINOS_DEL_BALDIO,
  VECINOS_DEL_INFIERNO, VECINOS_DEL_TEMPLO,
} from './escenas.ts';
import { ACECHO, BAJO, BANDERAS, DRACULA, DRACULA_ARMADO, PASTURA, ESCENA, PALO, PIERRE, PIERRE_ARMADO, PRISION, deLaTapa } from './rig.ts';
import { ARMADO, RECORTES, cajaDeRecorte, LADO_TAPA } from './recortes.ts';
import { PIEZAS } from './arte.ts';
import { ETIQUETA, PIEZAS_BAJO, PIEZAS_PIERRE, PUERTA, agujero } from './arte-bajo.ts';
import { pincelada } from './pincel.ts';
import { PIEZAS_DRACULA, PIEZAS_PRISION } from './arte-prision.ts';
import { envolventes, tallar, tono } from './grabado.ts';

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
    'src/lib/bestiario/arte-prision.ts', 'src/lib/bestiario/grabado.ts', 'src/lib/bestiario/aerografo.ts',
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

test('cada recinto genérico y la ruta salen sin números rotos', () => {
  for (const r of datos.regiones) {
    if (r.forma.tipo === 'anillo' || r.id === 'el-monte' || r.id === 'la-pastura') continue;
    const { svg } = dibujarRecinto(r, datos);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), `el recinto ${r.id} tiene un número roto`);
  }
  assert.ok(!/NaN|undefined|Infinity/.test(dibujarRuta(datos)));
});

test('cada pieza del aerógrafo y cada recorte están en public/bestiario', () => {
  // Las imprime `node --experimental-strip-types scripts/imprimir-bestiario.mjs`. Una pieza
  // que la página pide y no está impresa es un agujero en el monte.
  // Los recortes de las tapas los hace `scripts/recortar-bestiario.mjs`.
  const nombres = [...PIEZAS.map((p) => p.nombre), ...RECORTES.map((r) => r.nombre)];
  const faltan = nombres.filter((n) => !existsSync(`public/bestiario/${n}.webp`));
  assert.deepEqual(faltan, []);
  const piden = [...(lobo() + cordero() + escenaMonte(new Map()) + escenaBajo(new Map()) + escenaPrision(new Map())).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]);
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
  // Pierre y la drácula no son de tapa pero tienen títere: su ficha también los muestra como en la escena.
  const dePierre = retrato('el-gordo-pierre');
  assert.ok(dePierre && dePierre.svg.includes('pierre-cabeza') && !/NaN/.test(dePierre.caja));
  const deLaDracula = retrato('la-dracula-con-tacones');
  assert.ok(deLaDracula && deLaDracula.svg.includes('dracula-forro-1') && !/NaN/.test(deLaDracula.caja), 'la drácula no tiene retrato con la capa abierta');
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
  const dibujan = ['arte.ts', 'arte-bajo.ts', 'arte-prision.ts', 'aerografo.ts', 'pincel.ts', 'grabado.ts', 'escenas.ts', 'escena-monte.ts', 'titeres.ts', 'figuras.ts', 'mapa.ts'];
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
 * La séptima vuelta: la prisión de Barbazul y la drácula con tacones, tallados como la gente de
 * la tapa de *Oktubre* (`arte-prision.ts`, `grabado.ts`).
 */

test('la drácula es un títere entero: cada pieza que mueve la isla, con su imagen y su bisagra', () => {
  const marcado = dracula();
  const partes = ['capa-atras', 'pierna-1', 'pierna-2', 'cuerpo', 'cabeza', 'mandibula', 'parpado-1', 'parpado-2', 'forro-1', 'forro-2', 'capa-1', 'capa-2', 'mano', 'pelo'];
  for (const parte of partes) assert.ok(marcado.includes(`data-parte="${parte}"`), `a la drácula le falta ${parte}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_DRACULA.map((p) => p.nombre).sort(), 'la drácula usa piezas que no se imprimen, o le sobra una');
  const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_DRACULA.find((p) => p.nombre === nombre)!.caja;
  const adentro = (nombre: string, [x, y]: readonly [number, number]): boolean => {
    const [x0, y0, ancho, alto] = caja(nombre);
    return x >= x0 && x <= x0 + ancho && y >= y0 && y <= y0 + alto;
  };
  for (const o of DRACULA_ARMADO.ojos) assert.ok(adentro('dracula-cabeza', o.centro), 'un ojo se salió de la cara');
  assert.ok(adentro('dracula-cuerpo', DRACULA_ARMADO.cuello) && adentro('dracula-cabeza', DRACULA_ARMADO.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('dracula-pierna-1', DRACULA_ARMADO.caderas[0]) && adentro('dracula-pierna-2', DRACULA_ARMADO.caderas[1]), 'una pierna no cuelga de su cadera');
  assert.ok(adentro('dracula-mano', DRACULA_ARMADO.mano), 'la mano no está donde cierra la capa');
  // Cada mitad de la capa y su forro giran en el mismo hombro: la bisagra toca a los dos.
  for (const [n, [hx, hy]] of DRACULA_ARMADO.hombros.entries()) {
    assert.ok(adentro(`dracula-capa-${n + 1}`, [hx, hy + 8]), `la capa ${n + 1} no llega a su hombro`);
    assert.ok(adentro(`dracula-forro-${n + 1}`, [hx, hy]), `el forro ${n + 1} no sale de su hombro`);
  }
  // Y el forro arranca plegado: sin la isla, la capa está cerrada.
  for (const m of marcado.matchAll(/data-parte="forro-\d"[^>]*>/g)) assert.match(m[0], /scale\(0\.001 1\)/);
  for (const m of marcado.matchAll(/data-parte="(capa|forro)-\d"[^>]*>/g)) assert.match(m[0], /data-bisagra="-?\d+"/);
});

test('la prisión tiene a todos los suyos: la drácula camina por el pasillo, y la fiera más fiera no tiene ojos', () => {
  const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
  const escena = escenaPrision(nombres);
  const delRecinto = datos.bestias.filter((b) => b.region === 'la-prision').map((b) => b.id).sort();
  assert.deepEqual(delRecinto, ['la-dracula-con-tacones', JAULA_VACIA.id, ...Object.keys(VECINOS_DE_LA_PRISION)].sort(), 'en la prisión falta o sobra alguien');
  assert.ok(!/NaN|undefined|Infinity/.test(escena), 'la prisión tiene un número roto');
  for (const [id, [x, y]] of Object.entries(VECINOS_DE_LA_PRISION)) assert.ok(x >= 0 && x <= ESCENA.ancho && y >= 0 && y <= ESCENA.alto, `${id} se sale`);
  assert.ok(escena.includes(`data-id="${JAULA_VACIA.id}"`), 'la jaula vacía no se puede tocar');
  // La jaula se toca pero no mira: adentro de su grupo no hay ni un ojo.
  const jaula = escena.slice(escena.indexOf(`data-id="${JAULA_VACIA.id}"`), escena.indexOf('</g>', escena.indexOf(`data-id="${JAULA_VACIA.id}"`)));
  assert.ok(!jaula.includes('ojos-'), 'la fiera más fiera no aparece en la estampa: la jaula no tiene ojos');
  // La drácula camina por el piso del pasillo y no se sale de la escena ni con las alas abiertas a medias.
  const { x0, x1 } = PRISION.fondo;
  assert.ok(DRACULA.piso > PRISION.fondo.piso && DRACULA.piso < ESCENA.alto, 'la drácula no pisa el piso del pasillo');
  assert.ok(DRACULA.desde >= DRACULA_ARMADO.punta[0] * DRACULA.escala * 0.6 && DRACULA.hasta <= ESCENA.ancho - DRACULA_ARMADO.punta[0] * DRACULA.escala * 0.6);
  assert.ok(DRACULA.x >= DRACULA.desde && DRACULA.x <= DRACULA.hasta && x0 < x1);
  // Y no se mete en la jaula de adelante.
  assert.ok(DRACULA.hasta + 130 * DRACULA.escala < PRISION.jaula.x0, 'la drácula camina adentro de la jaula');
});

test('la calle de la ventana es la tapa de Oktubre, y las banderas que flamean son las suyas', () => {
  const tapas = PIEZAS_PRISION.flatMap((p) => [...p.dibujo.matchAll(/href="tapa:([a-z0-9-]+)"/g)].map((m) => `${p.nombre} ← ${m[1]}`));
  assert.ok(tapas.includes('prision-lejos ← oktubre-frontal'), 'la calle no es la tapa');
  for (let i = 1; i <= BANDERAS.length; i++) {
    const pieza = PIEZAS_PRISION.find((p) => p.nombre === `prision-bandera-${i}`)!;
    assert.ok(pieza.dibujo.includes('tapa:oktubre-frontal') && pieza.dibujo.includes('url(#solo-rojo)'), `la bandera ${i} no es lo rojo de la tapa`);
  }
  // A la calle se le sacan las banderas, para que no queden dobles cuando flamean.
  assert.ok(PIEZAS_PRISION.find((p) => p.nombre === 'prision-lejos')!.dibujo.includes('url(#sin-rojo)'));
  // Cada asta cae adentro de la ventana, o se vería flamear contra la pared.
  const { x0, x1, clave, abajo } = PRISION.ventana;
  for (const b of BANDERAS) {
    const [x, y] = deLaTapa(b.asta);
    assert.ok(x > x0 - 20 && x < x1 + 20 && y > clave - 20 && y < abajo + 20, `un asta cae afuera de la ventana: ${x}, ${y}`);
    for (const [px, py] of b.poligono) assert.ok(px >= 0 && px <= 953 && py >= 0 && py <= 953, 'una bandera se recorta afuera de la tapa');
  }
});

test('la talla de Oktubre sale igual en cada impresión, corta donde hay luz y no rompe ningún número', () => {
  const lineas = envolventes([0, 0], [40, 50], { paso: 3, semilla: 5 });
  const luz = tono(0, [{ c: [0, 0], r: [40, 50], peso: 1 }]);
  const una = tallar(lineas, luz, { ancho: 3, semilla: 7 });
  assert.equal(una, tallar(lineas, luz, { ancho: 3, semilla: 7 }));
  assert.ok(una.length > 200 && !/NaN|undefined|Infinity/.test(una));
  // Sin luz, la gubia no corta nada: la plancha queda negra.
  assert.equal(tallar(lineas, () => 0, { ancho: 3, semilla: 7 }), '');
  // Más luz, cortes más anchos: más papel.
  const area = (d: string): number => [...d.matchAll(/[ML]/g)].length;
  assert.ok(area(tallar(lineas, () => 1, { ancho: 3, semilla: 7 })) >= area(tallar(lineas, () => 0.5, { ancho: 3, semilla: 7 })));
  for (const p of PIEZAS_PRISION) assert.ok(!/NaN|undefined|Infinity/.test(p.dibujo), `${p.nombre} tiene un número roto`);
});
