import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { pozoDelSitio, leerBanco } from './pozo-del-sitio.ts';
import { armarCorpus, claveSinTildes, formaDe, variantesSinDeclarar, type TemaContable } from './conteo.ts';
import { fueraDeEnVivo, MINIMO_EN_VIVO, esMedidaPropia } from './datos.ts';
import { leerDiscos, leerDuraciones } from '../letra/temas.ts';
import { azarConSemilla, nuevaPartida, responder, siguientePaso, FAMILIAS } from './partida.ts';
import { referenciaNumero } from './referencia.ts';

/**
 * El pozo que se publica, contra los archivos de verdad (`US-10`, `BR-32`, `BR-33`, `CTR-20`).
 *
 * `conteo.test.ts` y `partida.test.ts` prueban las reglas sobre casos de juguete; esto
 * prueba que el banco real las cumple. Es acá donde se defiende lo único estricto del
 * proyecto (`CLAUDE.md`): que la respuesta correcta sea correcta.
 */

const BANCO = leerBanco();
const { isla: ISLA, fuentes: FUENTES } = pozoDelSitio(BANCO);
const POZO = ISLA.datos;
const temasContados = FUENTES.corpus.temas.length;
const totalDeTemas = FUENTES.totalDeTemas;
const CANCIONERO = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8')) as { temas: TemaContable[] };
const CORPUS = armarCorpus(CANCIONERO.temas);

const PALABRAS_LISTAS = BANCO.palabras.filter((p) => p.estado === 'listo');
const DATOS_LISTOS = BANCO.datos.filter((d) => d.estado === 'listo');

/**
 * El vocabulario del taller de guitarra y de la cifra, que no puede ser una palabra del
 * juego (`BR-33`): el cancionero todavía trae líneas de anotación tipadas como letra, y
 * con ellas *riff* o *intro* sumarían temas que nadie canta. Incluye los acordes en
 * castellano (*sol*, *la*, *mi*…), porque lacuerda.net los escribe así en líneas de letra.
 */
const TALLER = new Set([
  'riff', 'riffs', 'intro', 'outro', 'coda', 'estribillo', 'estrofa', 'verso', 'puente', 'solo',
  'base', 'interludio', 'parte', 'bis', 'acorde', 'acordes', 'guitarra', 'guitarras', 'bajo',
  'bateria', 'batería', 'teclado', 'arpegio', 'rasgueo', 'punteo', 'tab', 'tablatura', 'repetir',
  'repite', 'capo', 'traste', 'trastes', 'pua', 'púa', 'arreglo', 'cejilla', 'primera', 'segunda',
  'tercera', 'cuarta', 'intermedio', 'fill', 'toca', 'par', 'letra', 'tema', 'man', 'com', 'saxo',
  'do', 're', 'mi', 'fa', 'sol', 'la', 'si',
]);

// ─── El pozo entero ───────────────────────────────────────────────────────────────────

test('el pozo arranca: sin ids repetidos, y cada familia derivada trae lo que el repo tiene', () => {
  assert.doesNotThrow(() => nuevaPartida(POZO));
  const por = (f: string) => POZO.filter((d) => d.familia === f).length;
  // `US-10`, piso A: el piso de lo derivado es lo que el repo tiene. Si baja, se perdió algo.
  assert.equal(por('los-discos'), 19, 'diez años y nueve cantidades de temas (sin Gulp!)');
  assert.equal(por('lo-que-dura'), 94, 'los 105 menos los once sin duración del vol. 2');
  assert.ok(por('en-vivo') >= 90, `en vivo: ${por('en-vivo')}`);
});

test('las dos trampas de RES-20 no entran: ni cuántos temas tiene Gulp!, ni cuántos discos son', () => {
  assert.ok(!POZO.some((d) => d.id === 'temas-gulp'));
  assert.ok(!POZO.some((d) => /cu[aá]ntos discos/i.test(d.pregunta)));
});

test('en vivo: solo temas de los 105, con número inequívoco y del piso para arriba', () => {
  for (const d of POZO.filter((x) => x.familia === 'en-vivo')) {
    assert.ok(d.valor >= MINIMO_EN_VIVO, `${d.id}: ${d.valor}`);
    assert.ok(!fueraDeEnVivo(FUENTES.setlist.temas).has(d.id.slice('vivo-'.length)), d.id);
    // "Figura en", no "se tocó": son setlists que carga la gente (`RES-90`).
    assert.doesNotMatch(d.pregunta, /se toc[oó]|veces/i, `${d.id}: la pregunta dice otra cosa que lo que se cuenta`);
  }
});

test('cada dato dice de dónde salió, y la pregunta nunca dice "más o menos"', () => {
  for (const d of POZO) {
    assert.ok(d.fuente.trim().length > 0, `${d.id} sin fuente`);
    assert.doesNotMatch(d.pregunta, /m[aá]s o menos|antes o despu[eé]s/i, `${d.id}: eso lo dicen los botones`);
    assert.match(d.pregunta, /^¿.+\?$/, `${d.id}: la pregunta no es una pregunta`);
  }
});

test('ningún número del pozo deja la referencia sin lugar, en ningún escalón', () => {
  const azar = azarConSemilla(17);
  for (const d of POZO) {
    for (const racha of [0, 3, 6, 10]) {
      const ref = referenciaNumero(d.valor, d.escala, racha, azar, d.techo);
      assert.notEqual(ref, d.valor, d.id);
      if (d.techo !== undefined) assert.ok(ref < d.techo, `${d.id}: ${ref} con techo ${d.techo}`);
    }
  }
});

test('una partida perfecta sobre el pozo real recorre las siete familias y termina ganada', () => {
  const azar = azarConSemilla(2026);
  const estado = nuevaPartida(POZO);
  const vistas = new Set<string>();
  for (;;) {
    const paso = siguientePaso(estado, azar);
    if (!paso) break;
    vistas.add(paso.dato.familia);
    responder(estado, paso, paso.correcta);
  }
  assert.equal(estado.ganada, true);
  const conDatos = FAMILIAS.filter((f) => POZO.some((d) => d.familia === f));
  assert.deepEqual([...vistas].sort(), [...conDatos].sort());
});

// ─── Los datos a mano (`BR-32`) ───────────────────────────────────────────────────────

test('US-10, piso B: al menos 20 datos a mano listos, y al menos 4 en cada familia de la banda', () => {
  assert.ok(DATOS_LISTOS.length >= 20, `hay ${DATOS_LISTOS.length} datos a mano listos`);
  for (const familia of ['la-banda', 'la-gente', 'los-recitales']) {
    const n = DATOS_LISTOS.filter((d) => d.familia === familia).length;
    assert.ok(n >= 4, `${familia}: ${n}`);
  }
});

test('BR-32: cada dato a mano cita una ficha RES- que existe en Docs/INVESTIGACION', () => {
  const fichas = readdirSync('Docs/INVESTIGACION')
    .filter((f) => f.endsWith('.md'))
    .map((f) => readFileSync(`Docs/INVESTIGACION/${f}`, 'utf-8'))
    .join('\n');
  for (const d of BANCO.datos) {
    assert.match(d.fuente, /^RES-\d{2,3}$/, `${d.id}: la fuente no es una ficha`);
    assert.ok(new RegExp(`##+ ${d.fuente}\\b`).test(fichas), `${d.id}: ${d.fuente} no está fichada`);
    if (d.firmeza === 'segun') assert.ok(d.segun?.trim(), `${d.id}: "según" sin nombre`);
  }
});

test('BR-32: nada sobre muertes, heridos ni detenidos (CNT-04, CNT-06)', () => {
  const prohibido = /bulacio|olavarr[ií]a|muri[oó]|muerte|falleci|herid|detenid|v[ií]ctima/i;
  for (const d of BANCO.datos) {
    for (const texto of [d.pregunta, d.explicacion ?? '', d.sujeto ?? '']) {
      assert.doesNotMatch(texto, prohibido, `${d.id}: ${texto}`);
    }
  }
});

test('CTR-20: una medida compartida tiene la misma escala y unidad, y sujeto en todos', () => {
  const porMedida = new Map<string, typeof DATOS_LISTOS>();
  for (const d of DATOS_LISTOS) porMedida.set(d.medida, [...(porMedida.get(d.medida) ?? []), d]);
  for (const [medida, datos] of porMedida) {
    if (datos.length < 2) continue;
    // `CTR-20.11` i5, entera: misma familia, y sujetos distintos (`REV-16`, `FIND-83`). Dos
    // "el Indio" en la misma medida harían un par que se contesta mirando el nombre.
    assert.equal(new Set(datos.map((d) => d.familia)).size, 1, `${medida}: familias distintas`);
    assert.equal(new Set(datos.map((d) => d.sujeto)).size, datos.length, `${medida}: sujetos repetidos`);
    assert.equal(new Set(datos.map((d) => d.escala)).size, 1, `${medida}: escalas distintas`);
    assert.equal(new Set(datos.map((d) => JSON.stringify(d.unidad ?? null))).size, 1, `${medida}: unidades distintas`);
    for (const d of datos) assert.ok(d.sujeto, `${d.id}: va en par y no tiene sujeto`);
  }
});

test('CTR-20: los años son años, y las cantidades llevan su unidad', () => {
  for (const d of BANCO.datos) {
    assert.ok(Number.isInteger(d.valor), `${d.id}: ${d.valor}`);
    if (d.escala === 'anio') {
      assert.ok(d.valor >= 1900 && d.valor <= 2026, `${d.id}: ${d.valor}`);
      assert.equal(d.unidad, undefined, `${d.id}: un año no lleva unidad`);
    }
    if (d.escala === 'entero') {
      assert.ok(d.valor >= 1, `${d.id}: ${d.valor}`);
      assert.ok(d.unidad?.length === 2, `${d.id}: una cantidad sin unidad`);
    }
  }
});

// ─── Las palabras (`D-48` punto 4, `BR-33`) ───────────────────────────────────────────

test('US-10, piso C: al menos 15 palabras listas', () => {
  assert.ok(PALABRAS_LISTAS.length >= 15, `hay ${PALABRAS_LISTAS.length}`);
});

test('cada palabra lista aparece en 2 temas o más, y la palabra está entre sus formas', () => {
  for (const p of PALABRAS_LISTAS) {
    assert.ok(p.formas.map(formaDe).includes(formaDe(p.palabra)), `${p.id}: "${p.palabra}" no está en sus formas`);
    const dato = POZO.find((d) => d.id === `palabra-${p.id.toLowerCase()}`)!;
    assert.ok(dato.valor >= 2, `${p.id}: ${dato.valor} tema`);
    assert.equal(dato.valor, dato.temas!.length, `${p.id}: el número y la lista cuentan distinto`);
  }
});

test('ninguna forma es del taller de guitarra ni un acorde escrito en castellano', () => {
  for (const p of PALABRAS_LISTAS) {
    for (const f of p.formas) assert.ok(!TALLER.has(formaDe(f)), `${p.id}: "${f}"`);
  }
});

test('ninguna forma está en dos palabras: si no, el número de una contaría la otra', () => {
  const vistas = new Map<string, string>();
  for (const p of PALABRAS_LISTAS) {
    for (const f of p.formas) {
      const k = formaDe(f);
      assert.ok(!vistas.has(k), `"${f}" está en ${vistas.get(k)} y en ${p.id}`);
      vistas.set(k, p.id);
    }
  }
});

test('toda variante de tilde que existe en el cancionero está clasificada: cuenta o no cuenta', () => {
  for (const p of PALABRAS_LISTAS) {
    assert.deepEqual(variantesSinDeclarar(p, CORPUS), [], `${p.id}: variantes sin clasificar`);
  }
});

test('las formas se escriben como se cuentan: minúscula, solo letras', () => {
  for (const p of BANCO.palabras) {
    for (const f of p.formas) {
      assert.equal(f, formaDe(f), `${p.id}: "${f}" no está en minúscula NFC`);
      assert.match(f, /^\p{L}+$/u, `${p.id}: "${f}"`);
      assert.ok(claveSinTildes(f).length > 0);
    }
  }
});

test('el rótulo de las palabras dice cuántos temas se contaron, de los 105', () => {
  assert.equal(totalDeTemas, 105);
  assert.equal(temasContados, CORPUS.temas.length);
  const palabra = POZO.find((d) => d.familia === 'las-palabras')!;
  assert.match(palabra.fuente, new RegExp(`\\b${temasContados}\\b.*\\b105\\b`));
});

test('cada tema de la lista de una palabra tiene su página de letra en el sitio', () => {
  const slugs = new Set(CANCIONERO.temas.map((t) => t.slug));
  for (const d of POZO.filter((x) => x.temas)) {
    for (const t of d.temas!) assert.ok(slugs.has(t.slug), `${d.id}: ${t.slug}`);
  }
  assert.ok(existsSync('src/pages/letras-y-acordes/[slug].astro'));
});

// ─── CTR-20.11: las derivadas, el pozo y lo que viaja ─────────────────────────────────

test('CTR-20 i13: diez años de disco y nueve cantidades, cada una igual al encabezado de RES-20', () => {
  const ficha = readFileSync('Docs/INVESTIGACION/INV-20-fuentes-primarias.md', 'utf-8').replace(/\r\n/g, '\n');
  // Los encabezados de los tracklists, en el orden de la ficha, que es el de `DISCOS`:
  // "### Oktubre — 4-oct-1986, … · 9 temas".
  const declarados = ficha
    .split('\n')
    .map((l) => /^### .* · (\d+) temas\s*$/.exec(l))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]));
  const discos = leerDiscos();
  assert.equal(declarados.length, discos.length);
  assert.equal(POZO.filter((d) => d.medida === 'anio-disco').length, 10);
  const cantidades = POZO.filter((d) => d.medida === 'temas-disco');
  assert.equal(cantidades.length, 9);
  discos.forEach((disco, i) => {
    const dato = cantidades.find((d) => d.id === `temas-${disco.disco}`);
    if (dato) assert.equal(dato.valor, declarados[i], `${disco.disco}: el parser contó otra cosa que el encabezado`);
  });
});

test('CTR-20 i14: una duración por cada tema medido de RES-20, y ninguna más', () => {
  const medidos = leerDuraciones().filter((t) => t.segundos !== null).length;
  assert.equal(POZO.filter((d) => d.medida === 'duracion').length, medidos);
});

test('CTR-20 i15: en vivo son exactamente las líneas con slug, del piso para arriba, sin grafía aparte', () => {
  const fuera = fueraDeEnVivo(FUENTES.setlist.temas);
  assert.deepEqual([...fuera], ['mariposa-pontiac-rock-del-pais']);
  const esperados = FUENTES.setlist.temas
    .filter((t) => t.slug && !fuera.has(t.slug) && t.veces >= MINIMO_EN_VIVO)
    .map((t) => `vivo-${t.slug}`)
    .sort();
  assert.deepEqual(POZO.filter((d) => d.familia === 'en-vivo').map((d) => d.id).sort(), esperados);
});

test('CTR-20 i16 e i17: el techo está solo donde hace falta, y el número nunca lo pasa', () => {
  for (const d of POZO) {
    const conTecho = d.familia === 'en-vivo' || d.familia === 'las-palabras';
    assert.equal(d.techo !== undefined, conTecho, d.id);
    if (d.techo !== undefined) assert.ok(d.valor <= d.techo, d.id);
  }
  for (const d of POZO.filter((x) => x.familia === 'las-palabras')) assert.equal(d.techo, temasContados);
  for (const d of POZO.filter((x) => x.familia === 'en-vivo')) assert.equal(d.techo, FUENTES.setlist.setlistsCargados);
});

test('CTR-20 i17: ids y preguntas únicos; una pregunta a mano que repite una derivada es un número copiado', () => {
  assert.equal(new Set(POZO.map((d) => d.id)).size, POZO.length);
  const repetidas = POZO.map((d) => d.pregunta).filter((q, i, todas) => todas.indexOf(q) !== i);
  assert.deepEqual(repetidas, []);
  assert.ok(new Set(POZO.map((d) => d.familia)).size >= 2);
});

test('CTR-20 i4 e i6: la medida propia es el id; un "según" nombra a quien lo dijo en la pregunta', () => {
  for (const d of BANCO.datos.filter((x) => x.estado !== 'retirado')) {
    if (esMedidaPropia(d.medida)) assert.equal(d.medida, d.id, d.id);
    if (d.firmeza === 'segun') {
      assert.ok(d.pregunta.toLowerCase().includes(d.segun!.toLowerCase()), `${d.id}: la pregunta no dice "${d.segun}"`);
    }
  }
});

test('CTR-20 i18: lo que viaja no lleva notas internas ni estados, y entra en 160 KB', () => {
  const texto = JSON.stringify(ISLA);
  for (const clave of ['notaInterna', 'estado', 'firmeza', '"segun"', 'noCuentan']) {
    assert.ok(!texto.includes(clave.startsWith('"') ? `${clave}:` : `"${clave}":`), `viaja ${clave}`);
  }
  assert.ok(texto.length <= 160 * 1024, `${Math.round(texto.length / 1024)} KB`);
  assert.ok(ISLA.enVivo && /^https:\/\/www\.setlist\.fm\//.test(ISLA.enVivo.pagina));
  assert.match(ISLA.enVivo!.consultado, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(ISLA.palabras, { contados: temasContados, total: 105 });
});
