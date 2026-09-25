/**
 * Los dos muñecos (`T-275`, ciclo 16; `D-44`): Skayboy y Poligirl con los mismos estados, los
 * mismos cuadros, la misma celda, y cada uno con sus tintas.
 *
 * Lee `src/arte/pixel/skayboy.txt` y `poligirl.txt` con el mismo lector que usa la imprenta
 * (`leerDibujo`), así que lo que acá pasa es lo que se imprime. `D-44` consecuencia 3 lo dejó
 * escrito: **la paridad de `BR-23.2` se cuenta comparando, no mirando.** Lo que se cuenta:
 *
 * 1. **Mismos estados, en el mismo orden, con los mismos cuadros, la misma velocidad y la misma
 *    repetición** (`BR-23.2`, `CTR-15.7`). El orden es la fila del atlas, y la fila es de lo que
 *    el motor da por cierto (`CTR-15.8`): un estado corrido de fila en uno solo dibuja a uno
 *    corriendo con la pose del otro.
 * 2. **La misma celda y la misma caja de colisión** (`CTR-15.3`): paridad mecánica, no estética.
 * 3. **Cada uno con sus tres tintas y las dos fijas, nada más** (`UX-27 §4`). Una tinta de
 *    personaje ajena es un pedazo del otro puesto encima (`D-38`). Y ninguno usa una tinta más
 *    que el otro: *"ninguno de los dos tiene un color más que el otro"*.
 * 4. **La misma altura, cuadro por cuadro**: la figura arranca y termina en el mismo renglón en
 *    los dos (`BR-23.2`, *"mismo alto de sprite"*), entra en 14 × 22 con un píxel de aire a
 *    cada costado (`UX-27 §2`), y en lo que está en el piso el pie apoya en el borde de abajo de
 *    la celda (`CTR-15.3`), que es donde apoya la caja.
 * 5. **El contorno** (`UX-27 §5.2`): ningún píxel de tinta toca el aire, ni el borde de la celda,
 *    sin clave. Sin excepción, dice el contrato, y el pelo de Poli no es la clave (`§4.2`).
 * 6. **Lo que la isla pide existe en los dos** (`UX-28 §3`): cada pose que devuelve `poseDe()`
 *    tiene su estado en los dos atlas. `CTR-15.7` tiene `salta` y `cae`, y `mundo.ts` una sola
 *    pose en el aire: se resuelve dentro de los contratos, las dos filas para `perfil-aire`, y la
 *    isla elige por el signo de `vy` (`T-278`). `cae` se dibuja derecho y con los brazos abiertos
 *    (`UX-27 §7`), nunca dado vuelta (`UX-29 §6`).
 *
 * Lo que no se puede contar —que las dos siluetas se reconozcan igual de bien a 32 × 48 CSS en
 * color y en gris (`BR-23.3`), que ninguna pose narre nada ni ridiculice a nadie (`D-38`,
 * `D-42`, `BR-24`)— lo mira `revisor` en la hoja de contacto y lo aprueba el usuario (`D-44`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { TRANSPARENTE, jsonDelAtlas, leerDibujo, sinBom, tintasUsadas, type Dibujo, type JsonDelAtlas } from '../pixel/fuente.ts';
import { diferenciasConLoPublicado, rutaPublicada, type Publicado } from '../pixel/publicado.ts';
import { paletaDelArea } from '../pixel/tokens.ts';
import { CAIDA_MAXIMA, IMPULSO_SALTO, PERSONAJES, VELOCIDAD, poseDe, type Cuerpo, type Pose } from './mundo.ts';
import type { IdPersonaje } from './niveles.ts';

const ARCHIVO: Readonly<Record<IdPersonaje, string>> = {
  skayboy: 'src/arte/pixel/skayboy.txt',
  poligirl: 'src/arte/pixel/poligirl.txt',
};

/** `UX-27 §4`: tres y tres, y ninguno tiene un color más que el otro. */
const PROPIAS: Readonly<Record<IdPersonaje, readonly string[]>> = {
  skayboy: ['--px-skay-1', '--px-skay-2', '--px-skay-3'],
  poligirl: ['--px-poli-1', '--px-poli-2', '--px-poli-3'],
};
/** Los dos fijos del área: la clave es el contorno, la luz es el aire (`UX-27 §1.1`). */
const FIJAS: readonly string[] = ['--px-clave', '--px-luz'];

/**
 * Lo que está en el piso apoya el pie en el borde de abajo de la celda (`CTR-15.3`). `baila`
 * también (`CTR-15.7`, *"Dónde está la figura"*; `UX-33 §2.2` punto 3): la energía del baile la
 * dice la pose, no un saltito que saque la figura de la caja.
 */
const EN_EL_PISO: readonly string[] = ['quieto', 'corre', 'enPausa', 'baila'];

/**
 * El sexto estado (`D-47` punto 3, `CTR-15.7`): **cuatro cuadros** —el ancho que el atlas ya
 * tiene, `UX-33 §2.2` punto 1— a **8 por segundo** —distinto de los 10 de `corre`, `UX-33 §2.2`,
 * que elige adentro del rango de 3 a 10 de `CTR-15.7`— y **en bucle**: dura lo que la persona
 * tarde en tocar para seguir.
 */
const BAILA = { cuadros: 4, porSegundo: 8, repite: true } as const;

/**
 * La parte del cuerpo que dice qué paso se baila: de la cintura al piso (`UX-33 §2.2` punto 2).
 * Arriba de eso la silueta es la insignia —el sombrero, la mata de pelo— y ya distingue a los
 * dos sin que nadie baile; abajo es donde dos pasos iguales se verían iguales.
 */
const DESDE_LA_CINTURA = 17;

/**
 * Qué estado del atlas dibuja cada pose de `poseDe()` (`UX-28 §3`). Está tipado contra `Pose`:
 * si `mundo.ts` suma una pose, esto no compila hasta que alguien decida con qué se dibuja.
 */
const ESTADOS_DE_POSE: Readonly<Record<Pose, readonly string[]>> = {
  frente: ['enPausa'],
  'perfil-quieto': ['quieto'],
  'perfil-corre': ['corre'],
  'perfil-aire': ['salta', 'cae'],
};

/** `UX-27 §2`: la figura mide 14 × 22 adentro de la celda de 16 × 24, un píxel de aire a cada costado. */
const COLUMNA_MIN = 1;
const COLUMNA_MAX = 14;
const FILA_MIN = 2;

function leer(quien: IdPersonaje): Dibujo {
  const archivo = ARCHIVO[quien];
  const { dibujo, errores } = leerDibujo(readFileSync(archivo, 'utf-8'), archivo);
  assert.ok(dibujo, `${archivo} no se deja leer:\n  ${errores.join('\n  ')}`);
  return dibujo;
}

function losDos(): Readonly<Record<IdPersonaje, Dibujo>> {
  return { skayboy: leer('skayboy'), poligirl: leer('poligirl') };
}

/** `"corre 3"` → la grilla. */
function cuadrosDe(d: Dibujo): Map<string, readonly string[]> {
  return new Map(d.cuadros.map((c) => [`${c.estado} ${c.indice}`, c.filas]));
}

/** Hasta dónde llega la figura en un cuadro: los renglones y columnas con tinta. */
function extension(filas: readonly string[]): { arriba: number; abajo: number; izquierda: number; derecha: number } {
  let arriba = Infinity;
  let abajo = -Infinity;
  let izquierda = Infinity;
  let derecha = -Infinity;
  filas.forEach((fila, y) =>
    [...fila].forEach((car, x) => {
      if (car === TRANSPARENTE) return;
      arriba = Math.min(arriba, y);
      abajo = Math.max(abajo, y);
      izquierda = Math.min(izquierda, x);
      derecha = Math.max(derecha, x);
    }),
  );
  return { arriba, abajo, izquierda, derecha };
}

test('los dos se leen, y los dos son personajes: la misma celda y la misma caja (CTR-15.3)', () => {
  const d = losDos();
  const sk = jsonDelAtlas(d.skayboy);
  const po = jsonDelAtlas(d.poligirl);
  assert.deepEqual(po.celda, sk.celda, `la celda difiere: skayboy ${sk.celda.ancho} × ${sk.celda.alto}, poligirl ${po.celda.ancho} × ${po.celda.alto}`);
  assert.deepEqual(po.colision, sk.colision, 'la caja de colisión difiere, y es paridad mecánica (CTR-15.3)');
  for (const quien of PERSONAJES) {
    assert.equal(d[quien].tipo, 'personaje', `${ARCHIVO[quien]}: un muñeco es un personaje de 16 × 24, no un tile`);
  }
  assert.deepEqual(sk.colision, { ancho: 10, alto: 20 }, 'la caja de CTR-15.3 es de 10 × 20');
});

test('los mismos estados, en el mismo orden, con los mismos cuadros (BR-23.2)', () => {
  const d = losDos();
  const problemas: string[] = [];
  for (const [uno, otro] of [['skayboy', 'poligirl'], ['poligirl', 'skayboy']] as const) {
    const delOtro = new Map(d[otro].estados.map((e) => [e.nombre, e]));
    for (const e of d[uno].estados) {
      if (!delOtro.has(e.nombre)) problemas.push(`a ${otro} le falta el estado ${e.nombre}, que ${uno} tiene`);
    }
    const cuadrosDelOtro = cuadrosDe(d[otro]);
    for (const clave of cuadrosDe(d[uno]).keys()) {
      if (!cuadrosDelOtro.has(clave)) problemas.push(`a ${otro} le falta el cuadro ${clave}, que ${uno} tiene`);
    }
  }
  const po = new Map(d.poligirl.estados.map((e) => [e.nombre, e]));
  for (const e of d.skayboy.estados) {
    const par = po.get(e.nombre);
    if (!par) continue;
    if (par.cuadros !== e.cuadros) problemas.push(`${e.nombre}: skayboy tiene ${e.cuadros} cuadros y poligirl ${par.cuadros}`);
    if (par.porSegundo !== e.porSegundo) problemas.push(`${e.nombre}: skayboy va a ${e.porSegundo} por segundo y poligirl a ${par.porSegundo}`);
    if (par.repite !== e.repite) problemas.push(`${e.nombre}: uno repite y el otro no`);
  }
  const orden = (x: Dibujo) => x.estados.map((e) => e.nombre).join(', ');
  if (orden(d.skayboy) !== orden(d.poligirl)) {
    problemas.push(`las filas del atlas van en otro orden (CTR-15.8): skayboy ${orden(d.skayboy)} · poligirl ${orden(d.poligirl)}`);
  }
  assert.deepEqual(problemas, [], `los dos atlas no son pares:\n  ${problemas.join('\n  ')}`);
});

test('cada uno con sus tres tintas y las dos fijas: ninguna del otro, ninguna de más (UX-27 §4)', () => {
  const d = losDos();
  for (const quien of PERSONAJES) {
    const permitidas = new Set([...PROPIAS[quien], ...FIJAS]);
    for (const [car, nombre] of d[quien].leyenda) {
      const ajena = PERSONAJES.find((otro) => otro !== quien && PROPIAS[otro].includes(nombre));
      assert.ok(
        ajena === undefined,
        `${ARCHIVO[quien]}: "${car}" es ${nombre}, una tinta de ${ajena}: sería un pedazo del otro puesto encima (D-38, UX-27 §4)`,
      );
      assert.ok(permitidas.has(nombre), `${ARCHIVO[quien]}: "${car}" es ${nombre}, que no es de las suyas ni una fija (UX-27 §4)`);
    }
  }
});

test('ninguno de los dos tiene un color más que el otro (UX-27 §4)', () => {
  const d = losDos();
  const sk = tintasUsadas(d.skayboy);
  const po = tintasUsadas(d.poligirl);
  const fijas = (usadas: string[]) => usadas.filter((t) => FIJAS.includes(t)).sort().join(', ');
  assert.equal(fijas(po), fijas(sk), `las fijas difieren: skayboy usa ${fijas(sk)}, poligirl ${fijas(po)}`);
  assert.equal(po.length, sk.length, `skayboy usa ${sk.length} tintas y poligirl ${po.length}`);
});

test('la misma altura en cada cuadro, y la figura entra en 14 × 22 (BR-23.2, UX-27 §2, CTR-15.3)', () => {
  const d = losDos();
  const problemas: string[] = [];
  const po = cuadrosDe(d.poligirl);
  for (const [clave, filas] of cuadrosDe(d.skayboy)) {
    const par = po.get(clave);
    if (!par) continue; // falta el cuadro: lo dice el test de los estados
    const a = extension(filas);
    const b = extension(par);
    if (a.arriba !== b.arriba) problemas.push(`${clave}: la figura arranca en el renglón ${a.arriba} en skayboy y en el ${b.arriba} en poligirl`);
    if (a.abajo !== b.abajo) problemas.push(`${clave}: la figura termina en el renglón ${a.abajo} en skayboy y en el ${b.abajo} en poligirl`);
  }
  for (const quien of PERSONAJES) {
    for (const [clave, filas] of cuadrosDe(d[quien])) {
      const e = extension(filas);
      if (e.arriba < FILA_MIN) problemas.push(`${quien} ${clave}: arranca en el renglón ${e.arriba}; la figura mide 22 y el pie va abajo`);
      if (e.izquierda < COLUMNA_MIN || e.derecha > COLUMNA_MAX) {
        problemas.push(`${quien} ${clave}: ocupa las columnas ${e.izquierda} a ${e.derecha}, y el aire de los costados es de un píxel`);
      }
      const estado = clave.split(' ')[0]!;
      if (EN_EL_PISO.includes(estado) && e.abajo !== filas.length - 1) {
        problemas.push(`${quien} ${clave}: está en el piso y el pie no apoya en el renglón de abajo (${e.abajo})`);
      }
    }
  }
  assert.deepEqual(problemas, [], problemas.join('\n  '));
});

test('ningún píxel de tinta toca el aire sin contorno de clave (UX-27 §5.2)', () => {
  const d = losDos();
  const problemas: string[] = [];
  for (const quien of PERSONAJES) {
    const dib = d[quien];
    const clave = [...dib.leyenda].find(([, nombre]) => nombre === '--px-clave')?.[0];
    assert.ok(clave, `${ARCHIVO[quien]}: no declara la clave, y el contorno es de clave`);
    for (const [nombre, filas] of cuadrosDe(dib)) {
      const alto = filas.length;
      filas.forEach((fila, y) =>
        [...fila].forEach((car, x) => {
          if (car === TRANSPARENTE || car === clave) return;
          const aire = (xx: number, yy: number) =>
            yy < 0 || yy >= alto || xx < 0 || xx >= fila.length || [...filas[yy]!][xx] === TRANSPARENTE;
          if (aire(x + 1, y) || aire(x - 1, y) || aire(x, y + 1) || aire(x, y - 1)) {
            problemas.push(`${quien} ${nombre}: renglón ${y}, columna ${x} ("${car}", ${dib.leyenda.get(car)})`);
          }
        }),
      );
    }
  }
  assert.deepEqual(problemas, [], `tinta contra el aire, sin contorno:\n  ${problemas.join('\n  ')}`);
});

test('cada pose que pide la isla tiene su estado en los dos atlas (UX-28 §3)', () => {
  const d = losDos();
  // Todas las combinaciones de lo que poseDe() mira hoy, y la velocidad vertical por si mañana
  // mira también eso: la pose de subir y la de bajar son dos estados del atlas.
  const poses = new Set<Pose>();
  for (const conDedo of [false, true]) {
    for (const enSuelo of [false, true]) {
      for (const vx of [-VELOCIDAD, 0, VELOCIDAD]) {
        for (const vy of [-IMPULSO_SALTO, 0, CAIDA_MAXIMA]) {
          poses.add(poseDe({ conDedo, enSuelo, vx, vy } as Cuerpo));
        }
      }
    }
  }
  const faltan: string[] = [];
  for (const pose of poses) {
    const estados = ESTADOS_DE_POSE[pose];
    assert.ok(estados, `poseDe() devuelve "${pose}" y nadie decidió con qué estado se dibuja`);
    for (const quien of PERSONAJES) {
      const hay = new Set(d[quien].estados.map((e) => e.nombre));
      for (const e of estados) if (!hay.has(e)) faltan.push(`${quien}: la pose ${pose} se dibuja con ${e}, y no está`);
    }
  }
  assert.deepEqual(faltan, [], faltan.join('\n  '));
});

test('los dos bailan: cuatro cuadros a 8 por segundo, en bucle, en la última fila (D-47, CTR-15.7, UX-33 §2.2)', () => {
  const d = losDos();
  for (const quien of PERSONAJES) {
    const estados = d[quien].estados;
    const baila = estados.find((e) => e.nombre === 'baila');
    assert.ok(baila, `${ARCHIVO[quien]}: no tiene el estado baila, y al ganar los dos bailan (D-47 punto 3)`);
    assert.deepEqual(
      { cuadros: baila.cuadros, porSegundo: baila.porSegundo, repite: baila.repite },
      BAILA,
      `${ARCHIVO[quien]}: baila va con ${BAILA.cuadros} cuadros, ${BAILA.porSegundo} por segundo y en bucle (UX-33 §2.2)`,
    );
    assert.equal(
      estados.at(-1)?.nombre,
      'baila',
      `${ARCHIVO[quien]}: baila va en la última fila, la 5 — sumarla al final no mueve las otras cinco (CTR-15.7)`,
    );
  }
});

/**
 * `UX-33 §2.2` punto 2 y `§2.6`: *"no es el mismo ciclo desfasado en el tiempo: es una
 * coreografía distinta para cada uno"*. Lo que se cuenta: la silueta de la cintura para abajo,
 * cuadro por cuadro, como una vuelta. Si la vuelta de uno es la del otro corrida —o espejada—,
 * bailan el mismo paso, aunque uno lleve sombrero y la otra pelo. Que además no se miren ni
 * hagan un gesto de pareja lo mira el ojo en la hoja de contacto (`UX-33 §5` punto 8).
 */
test('no bailan el mismo paso: la vuelta de uno no es la del otro corrida ni espejada (UX-33 §2.2, §2.6)', () => {
  const d = losDos();
  const silueta = (filas: readonly string[]) =>
    filas.slice(DESDE_LA_CINTURA).map((f) => [...f].map((c) => (c === TRANSPARENTE ? '.' : '#')).join(''));
  const vuelta = (quien: IdPersonaje) =>
    d[quien].cuadros
      .filter((c) => c.estado === 'baila')
      .sort((a, b) => a.indice - b.indice)
      .map((c) => silueta(c.filas).join('\n'));
  const espejo = (s: string) => s.split('\n').map((f) => [...f].reverse().join('')).join('\n');
  const sk = vuelta('skayboy');
  const po = vuelta('poligirl');
  assert.equal(sk.length, BAILA.cuadros, 'skayboy no tiene los cuadros de baila');
  assert.equal(po.length, BAILA.cuadros, 'poligirl no tiene los cuadros de baila');
  for (const [nombre, otra] of [['igual', po], ['espejada', po.map(espejo)]] as const) {
    for (let corrida = 0; corrida < sk.length; corrida++) {
      const iguales = sk.every((s, i) => s === otra[(i + corrida) % otra.length]);
      assert.ok(
        !iguales,
        `la vuelta de poligirl, ${nombre} y corrida ${corrida}, es la de skayboy de la cintura para abajo: bailan el mismo paso (UX-33 §2.2)`,
      );
    }
  }
  // Y cada uno baila: una vuelta con los cuatro cuadros iguales es una pose, no un baile.
  for (const [quien, v] of [['skayboy', sk], ['poligirl', po]] as const) {
    const todos = d[quien].cuadros.filter((c) => c.estado === 'baila').map((c) => c.filas.join('\n'));
    assert.ok(new Set(todos).size === todos.length, `${quien}: dos cuadros de baila son el mismo dibujo, y cada cuadro es un paso`);
    assert.ok(new Set(v).size > 1, `${quien}: de la cintura para abajo no se mueve en ningún cuadro, y baila con el cuerpo`);
  }
});

/**
 * `CTR-15.7`, la fila *"Nada en la mano"* y `UX-27 §8.2`: ni guitarra, ni cigarrillo, ni ningún
 * objeto. La tinta de los objetos es `--px-tesoro`; un muñeco que la nombra está cargando uno.
 */
test('nadie baila con un objeto en la mano: ningún muñeco usa la tinta de los objetos (UX-27 §8.2)', () => {
  const d = losDos();
  for (const quien of PERSONAJES) {
    assert.ok(
      ![...d[quien].leyenda.values()].includes('--px-tesoro'),
      `${ARCHIVO[quien]}: nombra --px-tesoro, la tinta de la guitarra y el cigarrillo: nada en la mano (UX-27 §8.2)`,
    );
  }
});

/**
 * Lo que la isla carga no es el `.txt`: es `public/sprites/<pieza>.v<N>.png` y su `.json`. Si lo
 * publicado se separa de su fuente —un `.txt` tocado sin reimprimir, un JSON tocado a mano—,
 * todos los tests de arriba siguen en verde y el auditor de paleta también, porque ninguno mira
 * lo publicado (`T-300`, lo encontró la verificación: con `poligirl.v2.json` en `baila.cuadros=3`
 * el auditor dio "todo en regla"). `CTR-15.7`: *"la paridad se verifica comparando los dos JSON"*.
 */
async function leerPublicado(d: Dibujo): Promise<Publicado & { json: JsonDelAtlas }> {
  const base = rutaPublicada(d);
  assert.ok(existsSync(`${base}.json`) && existsSync(`${base}.png`), `${d.archivo} es la v${d.version} y ${base}.png / .json no están: reimprimí`);
  const json = JSON.parse(sinBom(readFileSync(`${base}.json`, 'utf-8'))) as JsonDelAtlas;
  const { data, info } = await sharp(readFileSync(`${base}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { json, ancho: info.width, alto: info.height, rgba: new Uint8Array(data) };
}

test('los dos atlas publicados son pares: los mismos estados, cuadros, velocidad y repetición, y baila en 4 a 8 en bucle (CTR-15.7)', async () => {
  const d = losDos();
  const sk = (await leerPublicado(d.skayboy)).json;
  const po = (await leerPublicado(d.poligirl)).json;
  const problemas: string[] = [];
  if (JSON.stringify(sk.celda) !== JSON.stringify(po.celda)) problemas.push('la celda publicada difiere');
  if (JSON.stringify(sk.colision) !== JSON.stringify(po.colision)) problemas.push('la caja de colisión publicada difiere (CTR-15.3)');
  const nombres = (j: JsonDelAtlas) => Object.keys(j.animaciones ?? {}).sort().join(', ');
  if (nombres(sk) !== nombres(po)) problemas.push(`los estados publicados difieren: skayboy ${nombres(sk)} · poligirl ${nombres(po)}`);
  for (const [nombre, a] of Object.entries(sk.animaciones ?? {})) {
    const b = po.animaciones?.[nombre];
    if (!b) continue;
    for (const campo of ['fila', 'cuadros', 'porSegundo', 'repite'] as const) {
      if (a[campo] !== b[campo]) problemas.push(`${nombre}.${campo}: skayboy publica ${a[campo]} y poligirl ${b[campo]}`);
    }
  }
  for (const [quien, j] of [['skayboy', sk], ['poligirl', po]] as const) {
    const b = j.animaciones?.baila;
    if (!b) problemas.push(`${rutaPublicada(d[quien])}.json no publica baila`);
    else if (b.cuadros !== BAILA.cuadros || b.porSegundo !== BAILA.porSegundo || b.repite !== BAILA.repite) {
      problemas.push(`${rutaPublicada(d[quien])}.json publica baila con ${b.cuadros} cuadros a ${b.porSegundo} por segundo, repite=${b.repite} (UX-33 §2.2)`);
    }
  }
  assert.deepEqual(problemas, [], `los dos atlas publicados no son pares:\n  ${problemas.join('\n  ')}`);
});

test('lo publicado es lo que imprime el dibujo: el JSON es el suyo y cada píxel del PNG también (CTR-15.7, CTR-15.8)', async () => {
  const d = losDos();
  const { tintas } = paletaDelArea(readFileSync('src/styles/tokens.css', 'utf-8'));
  const problemas: string[] = [];
  for (const quien of PERSONAJES) problemas.push(...diferenciasConLoPublicado(d[quien], tintas, await leerPublicado(d[quien])));
  assert.deepEqual(problemas, [], `lo publicado se separó de su fuente:\n  ${problemas.join('\n  ')}`);
});
