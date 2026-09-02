import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { DISCOS } from '../letra/discos.ts';
import { medidas, tapa } from '../sitio/arte.ts';
import { PASADAS, estampaDe, rutaFicha, rutaPasada, rutaTrasera, slugDeRecorte } from './pasadas.ts';

/**
 * El guardián del taller (`T-199`, ciclo 12): lo que `CTR-12` promete, hecho test.
 *
 * `scripts/generar-pasadas.mjs` produce cuarenta archivos que la estampa apila en
 * pantalla, y no corre en el build: viven en `public/` y se regeneran a mano. Eso deja
 * varias formas de que la pantalla se rompa sin que nadie lo vea, y este archivo mira
 * todas antes de que las mire un teléfono:
 *
 * - que falte un archivo (la estampa degrada, pero degrada en silencio);
 * - que uno pese más de lo que el contrato admite (lo paga un celular con 3G);
 * - que una separación **no lleve el color medido**: es el riesgo del ciclo tal como lo
 *   nombra el plan —"que la imprenta se vuelva un efecto"—, y la única forma de
 *   verificarlo es abrir el PNG y mirar los píxeles. Por eso el taller escribe RGBA de 8
 *   bits sin paleta (`CTR-12` §2): se decodifica acá con `node:zlib` y nada más;
 * - que una ficha se haya regenerado y las pasadas queden viejas: el manifiesto guarda
 *   el hash de la ficha y acá se recalcula. **El manifiesto no se cree, se comprueba.**
 */

const PASADAS_DIR = 'public/tapas/pasadas';
const TRASERAS_DIR = 'public/tapas/trasera';
const MANIFIESTO = 'scripts/pasadas-manifiesto.json';
const TOPE_PASADA = 20 * 1024;
const TOPE_PASADAS = 48 * 1024;
const TOPE_TRASERA = 40 * 1024;
/** Cuánto papel (sin imprimir) admite una estampa, como máximo. Desvío declarado de `ADR-05.1`. */
const MAXIMO_PAPEL = 0.2;
/** Cuánta clave tiene que haber, como mínimo: la cuota del taller menos la tolerancia. */
const MINIMO_CLAVE = 0.3;

const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
const hexDe = (nombre: string): string => {
  const m = tokens.match(new RegExp(`${nombre}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `falta ${nombre} en tokens.css`);
  return m![1]!.toLowerCase();
};
const rgbDe = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const luminancia = ([r, g, b]: [number, number, number]): number => {
  const canal = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
};

// ---------------------------------------------------------------- un lector de PNG mínimo

interface Png {
  ancho: number;
  alto: number;
  profundidad: number;
  tipoColor: number;
  entrelazado: number;
  /** RGBA, cuatro bytes por píxel. */
  pixeles: Buffer;
}

/**
 * Lee un PNG RGBA de 8 bits sin entrelazar: IHDR, los IDAT, `inflateSync` y los cinco
 * filtros de línea del estándar. Es todo lo que el contrato admite, y es a propósito: si
 * el taller escribiera otra cosa, este lector falla y el test lo dice.
 */
function leerPng(ruta: string): Png {
  const buf = readFileSync(ruta);
  assert.equal(buf.toString('ascii', 1, 4), 'PNG', `${ruta} no es un PNG`);
  let pos = 8;
  let ancho = 0, alto = 0, profundidad = 0, tipoColor = 0, entrelazado = 0;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const largo = buf.readUInt32BE(pos);
    const tipo = buf.toString('ascii', pos + 4, pos + 8);
    const datos = buf.subarray(pos + 8, pos + 8 + largo);
    if (tipo === 'IHDR') {
      ancho = datos.readUInt32BE(0);
      alto = datos.readUInt32BE(4);
      profundidad = datos[8]!;
      tipoColor = datos[9]!;
      entrelazado = datos[12]!;
    } else if (tipo === 'IDAT') idat.push(datos);
    pos += 12 + largo;
  }
  assert.equal(profundidad, 8, `${ruta}: profundidad ${profundidad}, CTR-12 pide 8 bits`);
  assert.equal(tipoColor, 6, `${ruta}: tipo de color ${tipoColor}, CTR-12 pide RGBA (6), sin paleta`);
  assert.equal(entrelazado, 0, `${ruta}: entrelazado, CTR-12 pide sin entrelazar`);

  const bpp = 4;
  const largoFila = ancho * bpp;
  const crudo = inflateSync(Buffer.concat(idat));
  const pixeles = Buffer.alloc(largoFila * alto);
  let previa = Buffer.alloc(largoFila);
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[y * (largoFila + 1)]!;
    const fila = crudo.subarray(y * (largoFila + 1) + 1, (y + 1) * (largoFila + 1));
    const actual = Buffer.alloc(largoFila);
    for (let x = 0; x < largoFila; x++) {
      const a = x >= bpp ? actual[x - bpp]! : 0;
      const b = previa[x]!;
      const c = x >= bpp ? previa[x - bpp]! : 0;
      let v = fila[x]!;
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else assert.equal(filtro, 0, `${ruta}: filtro ${filtro} desconocido`);
      actual[x] = v & 255;
    }
    actual.copy(pixeles, y * largoFila);
    previa = actual;
  }
  return { ancho, alto, profundidad, tipoColor, entrelazado, pixeles };
}

const rutaDe = (slug: string, pasada: string) => join(PASADAS_DIR, `${slug}-${pasada}.png`);

/** Los píxeles de una pasada, ya leídos, con lo que los tests preguntan. */
function analizar(slug: string, pasada: string) {
  const png = leerPng(rutaDe(slug, pasada));
  const n = png.ancho * png.alto;
  const colores = new Set<string>();
  let opacos = 0, transparentes = 0, intermedios = 0;
  const opaco = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const a = png.pixeles[i * 4 + 3]!;
    if (a === 255) {
      opacos++;
      opaco[i] = 1;
      colores.add(`#${[png.pixeles[i * 4], png.pixeles[i * 4 + 1], png.pixeles[i * 4 + 2]].map((v) => v!.toString(16).padStart(2, '0')).join('')}`);
    } else if (a === 0) transparentes++;
    else intermedios++;
  }
  return { png, n, colores: [...colores], opacos, transparentes, intermedios, opaco };
}

// ---------------------------------------------------------------- los casos

test('CTR-12.1: existen las tres pasadas y la trasera de cada uno de los diez discos', () => {
  const faltan: string[] = [];
  for (const slug of DISCOS) {
    for (const p of PASADAS) if (!existsSync(rutaDe(slug, p))) faltan.push(`${slug}-${p}.png`);
    if (!existsSync(join(TRASERAS_DIR, `${slug}.jpg`))) faltan.push(`trasera/${slug}.jpg`);
  }
  assert.deepEqual(faltan, [], `faltan en public/tapas: ${faltan.join(', ')}. Corre: node scripts/generar-pasadas.mjs`);
});

test('ADR-05.8: ninguna pasada pasa 20 KB, las tres de un disco no pasan 48, ninguna trasera pasa 40', () => {
  const pesados: string[] = [];
  for (const slug of DISCOS) {
    let tres = 0;
    for (const p of PASADAS) {
      const ruta = rutaDe(slug, p);
      if (!existsSync(ruta)) continue;
      const bytes = statSync(ruta).size;
      tres += bytes;
      if (bytes > TOPE_PASADA) pesados.push(`${slug}-${p}.png (${bytes} B)`);
    }
    if (tres > TOPE_PASADAS) pesados.push(`${slug}: las tres suman ${tres} B`);
    const tr = join(TRASERAS_DIR, `${slug}.jpg`);
    if (existsSync(tr) && statSync(tr).size > TOPE_TRASERA) pesados.push(`trasera/${slug}.jpg`);
  }
  assert.deepEqual(pesados, [], `pasan el tope de CTR-12: ${pesados.join(', ')}`);
});

test('ADR-05.1: cada pasada mide lo que mide su ficha, leido de los dos archivos', () => {
  for (const slug of DISCOS) {
    const ficha = medidas(`/tapas/${slug}.jpg`);
    assert.ok(ficha, `no se pudo medir la ficha de ${slug}`);
    for (const p of PASADAS) {
      const png = leerPng(rutaDe(slug, p));
      assert.equal(png.ancho, ficha.ancho, `${slug}-${p}: ancho ${png.ancho}, la ficha mide ${ficha.ancho}`);
      assert.equal(png.alto, ficha.alto, `${slug}-${p}: alto ${png.alto}, la ficha mide ${ficha.alto}`);
    }
  }
});

test('CTR-12 (el riesgo del ciclo): una sola tinta por archivo, y es la del token de su disco', () => {
  const mal: string[] = [];
  for (const slug of DISCOS) {
    const tinta = hexDe(`--disco-${slug}-tinta`);
    const apoyo = hexDe(`--disco-${slug}-apoyo`);
    const [clara, media] = luminancia(rgbDe(tinta)) >= luminancia(rgbDe(apoyo)) ? [tinta, apoyo] : [apoyo, tinta];
    const esperado: Record<string, string> = { clara, media, clave: hexDe('--fondo') };
    for (const p of PASADAS) {
      const { colores } = analizar(slug, p);
      if (colores.length !== 1) {
        mal.push(`${slug}-${p}: ${colores.length} colores (${colores.slice(0, 4).join(', ')}), tiene que ser uno`);
        continue;
      }
      const [real] = rgbDe(colores[0]!).map((v, i) => Math.abs(v - rgbDe(esperado[p]!)[i]!));
      const desvio = Math.max(...rgbDe(colores[0]!).map((v, i) => Math.abs(v - rgbDe(esperado[p]!)[i]!)));
      void real;
      if (desvio > 2) mal.push(`${slug}-${p}: lleva ${colores[0]} y el token dice ${esperado[p]}`);
    }
  }
  assert.deepEqual(mal, [], `separaciones con un color que no es el medido:\n  ${mal.join('\n  ')}`);
});

test('ADR-05.1: la clave de los diez discos es --fondo, y no un negro inventado', () => {
  const fondo = hexDe('--fondo');
  for (const slug of DISCOS) {
    const { colores } = analizar(slug, 'clave');
    assert.deepEqual(colores, [fondo], `${slug}-clave lleva ${colores.join('/')}`);
  }
});

test('tinta plana: ningun pixel con alfa intermedia, y ninguna pasada vacia ni llena', () => {
  const mal: string[] = [];
  for (const slug of DISCOS) {
    for (const p of PASADAS) {
      const { intermedios, opacos, transparentes } = analizar(slug, p);
      if (intermedios > 0) mal.push(`${slug}-${p}: ${intermedios} pixeles con alfa intermedia`);
      if (opacos === 0) mal.push(`${slug}-${p}: no imprime ni un pixel`);
      if (transparentes === 0) mal.push(`${slug}-${p}: es un rectangulo lleno`);
    }
  }
  assert.deepEqual(mal, [], mal.join('\n  '));
});

test('las tres mascaras son disjuntas, la clave pesa y el papel no pasa de lo declarado', () => {
  // Desvio declarado respecto de `ADR-05.1` regla 5 (`HILO-para-arquitectura-el-papel-de-la-estampa.md`):
  // hay una cuarta zona que no se imprime, el papel. Las mascaras siguen sin pisarse.
  const mal: string[] = [];
  for (const slug of DISCOS) {
    const capas = PASADAS.map((p) => analizar(slug, p));
    const n = capas[0]!.n;
    let dobles = 0, sinTinta = 0;
    for (let i = 0; i < n; i++) {
      const suma = capas.reduce((a, c) => a + c.opaco[i]!, 0);
      if (suma > 1) dobles++;
      if (suma === 0) sinTinta++;
    }
    if (dobles > 0) mal.push(`${slug}: ${dobles} pixeles en dos pasadas a la vez`);
    if (sinTinta / n > MAXIMO_PAPEL) mal.push(`${slug}: ${Math.round((sinTinta / n) * 100)} % de papel, el tope es ${MAXIMO_PAPEL * 100} %`);
    const clave = capas[2]!.opacos / n;
    if (clave < MINIMO_CLAVE) mal.push(`${slug}: la clave cubre ${Math.round(clave * 100)} %, el minimo es ${MINIMO_CLAVE * 100} %`);
  }
  assert.deepEqual(mal, [], mal.join('\n  '));
});

test('CTR-12.4: el manifiesto dice de que ficha salio cada estampa, y la ficha no cambio desde entonces', () => {
  assert.ok(existsSync(MANIFIESTO), `falta ${MANIFIESTO}: corre node scripts/generar-pasadas.mjs`);
  const manifiesto = JSON.parse(readFileSync(MANIFIESTO, 'utf-8')) as {
    discos: Record<string, { hashFicha: string; pasadas: Record<string, { hex: string; bytes: number }> }>;
  };
  const viejas: string[] = [];
  for (const slug of DISCOS) {
    const d = manifiesto.discos[slug];
    if (!d) { viejas.push(`${slug}: no esta en el manifiesto`); continue; }
    const hash = createHash('sha1').update(readFileSync(`public/tapas/${slug}.jpg`)).digest('hex').slice(0, 8);
    if (hash !== d.hashFicha) viejas.push(`${slug}: la ficha cambio (${hash}) y las pasadas son de ${d.hashFicha}`);
    for (const p of PASADAS) {
      const bytes = statSync(rutaDe(slug, p)).size;
      if (bytes !== d.pasadas[p]?.bytes) viejas.push(`${slug}-${p}: pesa ${bytes} B y el manifiesto dice ${d.pasadas[p]?.bytes}`);
    }
  }
  assert.deepEqual(viejas, [], `el manifiesto no describe lo que hay:\n  ${viejas.join('\n  ')}`);
});

test('ADR-05.4: las rutas son convencion, y lo que no es un disco no tiene ruta', () => {
  for (const slug of DISCOS) {
    assert.equal(rutaFicha(slug), tapa(slug), `${slug}: rutaFicha y arte.ts:tapa se separaron`);
    assert.equal(rutaPasada(slug, 'clave'), `/tapas/pasadas/${slug}-clave.png`);
    assert.equal(rutaTrasera(slug), `/tapas/trasera/${slug}.jpg`);
    const e = estampaDe(slug);
    assert.ok(e && e.pasadas[0] === rutaPasada(slug, 'clara') && e.trasera === rutaTrasera(slug));
  }
  for (const raro of ['en-directo', '', 'OKTUBRE', '../oktubre']) {
    assert.equal(rutaFicha(raro), null);
    assert.equal(rutaPasada(raro, 'clara'), null);
    assert.equal(rutaTrasera(raro), null);
    assert.equal(estampaDe(raro), null);
  }
});

test('CNT-14 §2.7: solo tres nombres van en su propia letra, y sin tilde solo donde la tapa no la lleva', () => {
  assert.equal(estampaDe('oktubre')!.letra, 'oktubre');
  assert.equal(estampaDe('lobo-suelto')!.letra, 'lobo-suelto');
  assert.equal(estampaDe('cordero-atado')!.letra, 'lobo-suelto');
  for (const slug of DISCOS.filter((s) => !['oktubre', 'lobo-suelto', 'cordero-atado'].includes(s))) {
    assert.equal(estampaDe(slug)!.letra, null, `${slug} no tiene letra propia calcada`);
  }
  assert.equal(estampaDe('ultimo-bondi-a-finisterre')!.nombreEstampado, 'ÚLTIMO BONDI A FINISTERRE');
  assert.equal(estampaDe('un-baion-para-el-ojo-idiota')!.nombreEstampado, 'UN BAIÓN PARA EL OJO IDIOTA');
  // Los tres calcados usan solo glifos que su fuente tiene (medido con fontTools el 2026-09-01).
  assert.match(estampaDe('oktubre')!.nombreEstampado, /^[ABCDEIKORTU]+$/);
  assert.match(estampaDe('lobo-suelto')!.nombreEstampado, /^[A-Z ]+$/);
  assert.match(estampaDe('cordero-atado')!.nombreEstampado, /^[A-Z ]+$/);
});

test('slugDeRecorte: todo recorte de zoom del banco de tapas delata su disco (T-206)', () => {
  assert.equal(slugDeRecorte('gulp-zoom'), 'gulp');
  assert.equal(slugDeRecorte('/tapas/detalle/lobo-suelto-zoom.jpg'), 'lobo-suelto');
  assert.equal(slugDeRecorte('gulp-montana'), null);
  const banco = JSON.parse(readFileSync('src/data/tapa.json', 'utf-8')) as {
    items: Array<{ id: string; estado: string; imagen: { archivo: string; encuadre: string } }>;
  };
  const sinEstampa = banco.items
    .filter((i) => i.estado === 'listo' && i.imagen.encuadre === 'detalle')
    .filter((i) => slugDeRecorte(i.imagen.archivo) === null)
    .map((i) => `${i.id} (${i.imagen.archivo})`);
  assert.deepEqual(sinEstampa, [], `recortes que no delatan su disco: ${sinEstampa.join(', ')}`);
});

test('el taller y discos.ts listan los mismos diez discos', () => {
  const script = readFileSync('scripts/generar-pasadas.mjs', 'utf-8');
  const faltan = DISCOS.filter((s) => !script.includes(`'${s}'`));
  assert.deepEqual(faltan, [], `discos sin taller: ${faltan.join(', ')}`);
});
