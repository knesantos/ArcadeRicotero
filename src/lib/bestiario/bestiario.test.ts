import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dibujar, dibujarGrupo } from './figuras.ts';
import { adentro, camara, contorno, dibujarRecinto, dibujarRuta, dibujarSuelo, punto, simbolos, type Bestiario } from './mapa.ts';
import { existsSync } from 'node:fs';
import { lobo, cordero } from './titeres.ts';
import { escenaMonte, VECINOS_DEL_MONTE } from './escena-monte.ts';
import { ACECHO, PASTURA, ESCENA, PALO } from './rig.ts';
import { ARMADO, RECORTES, cajaDeRecorte, LADO_TAPA } from './recortes.ts';
import { PIEZAS } from './arte.ts';

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
  const fuentes = ['src/lib/bestiario/figuras.ts', 'src/lib/bestiario/mapa.ts', 'src/lib/bestiario/titeres.ts', 'src/lib/bestiario/escena-monte.ts', 'src/scripts/bestiario.ts', 'src/data/bestiario.json'];
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
    assert.ok(ancho > 50 && alto > 50 && x + ancho <= LADO_TAPA && y + alto <= LADO_TAPA, `${r.nombre}: caja rara`);
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
  const piden = [...(lobo() + cordero() + escenaMonte(new Map())).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]);
  assert.ok(piden.length > 10);
  assert.deepEqual(piden.filter((n) => !nombres.includes(n!)), []);
});
