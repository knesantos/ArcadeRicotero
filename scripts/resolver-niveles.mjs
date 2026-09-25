/**
 * Resuelve los niveles de Skayboy y Poligirl con la máquina que juega sola (`T-266`), y graba la
 * traza de uno de cada nivel en `src/data/skayboy-soluciones.json` (`T-267`, `CTR-18`).
 *
 *   node scripts/resolver-niveles.mjs                      ← informa todos; no escribe nada
 *   node scripts/resolver-niveles.mjs --todos              ← lo mismo
 *   node scripts/resolver-niveles.mjs --nivel NIV-01       ← informa uno
 *   node scripts/resolver-niveles.mjs --regrabar           ← regraba los niveles en rojo
 *   node scripts/resolver-niveles.mjs --regrabar NIV-03    ← regraba ese
 *   node scripts/resolver-niveles.mjs --regrabar --todos   ← regraba todos (vale «--regrabar todos»)
 *
 * Con Node 22 va `--experimental-strip-types` antes del nombre del script, porque importa
 * TypeScript; desde Node 23.6 no hace falta, y el comando que nombran los mensajes del test es
 * el corto.
 *
 * Opciones de la búsqueda: `--cuadros N` (lo que dura una jugada; por defecto 4), `--holgura N`
 * (hasta dónde se ensancha la traza; por defecto 30), `--tope N` (hasta dónde se mide la
 * tolerancia; por defecto 60, `ADR-09.5`), `--nodos N` (el presupuesto) y `--libres` (cambios de
 * columna libres, ver `OpcionesDeBusqueda.cambios`). Y `--buscar`, que con `--regrabar` busca de
 * nuevo aunque la traza vieja siga valiendo.
 *
 * ## Qué informa
 *
 * Por nivel: **la traza grabada** —si vale, cuánto dura, su tolerancia exacta contra el mínimo
 * de `BR-29` para su escalón, y quién le abrió paso a quién (`CTR-18.8`)—; **la de uno que
 * encuentra la búsqueda**, con la más corta, que es el piso de cuánto dura el nivel; y **la de a
 * dos**, que se mide y no se graba (`CTR-18.4`). Al final, una tabla, el reparto de escalones y
 * la paridad del banco. Sale con 1 si algo está en rojo: un nivel que una persona sola no pasa
 * no cuenta para el piso (`BR-25` b), y el que lo dibujó se tiene que enterar acá, no en el
 * teléfono.
 *
 * ## Cómo regraba (`ADR-09.4`)
 *
 * Nada se regraba solo: esto lo corre una persona, y es **el único que escribe**
 * `skayboy-soluciones.json` (`CTR-18.11`), siempre en la forma canónica de `CTR-18.1`. Y nunca
 * escribe `skayboy.json`. Por nivel, en este orden, para que un ajuste chico dé un diff chico:
 *
 * 1. si la traza vieja **sigue valiendo** —lo mismo que mira `soluciones.test.ts`—, se queda;
 * 2. si **gana antes** de su último cuadro, se **recorta** hasta el cuadro de la victoria, y si
 *    así vale, se queda recortada;
 * 3. si no gana, o su tolerancia quedó corta, o no había, se **busca de nuevo**.
 *
 * Imprime la duración y la tolerancia de antes y de después. Si la búsqueda no encuentra traza
 * con la física de hoy, **la vieja no se toca** y sale con 1: el nivel no se pasa con esa física,
 * y se mueve el nivel o se vuelve atrás la constante (`ADR-09.4` punto 5). El diff del archivo es
 * el registro de qué afinado cambió qué solución.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CUADRO_SEG } from '../src/lib/skayboy/mundo.ts';
import { problemasDelBanco } from '../src/lib/skayboy/niveles.ts';
import { CUADROS_POR_JUGADA, HOLGURA, resolverDeADos, resolverSolo } from '../src/lib/skayboy/solucionador.ts';
import {
  TOPE_TOLERANCIA,
  diagnosticar,
  escribirTraza,
  largoDe,
  problemaDeParidad,
  problemaDeUnidad,
  recortar,
  sumarParidad,
  tolerancia,
  toleranciaMinima,
} from '../src/lib/skayboy/soluciones.ts';

const BANCO = join('src', 'data', 'skayboy.json');
const SOLUCIONES = join('src', 'data', 'skayboy-soluciones.json');
const CUADROS_POR_SEGUNDO = Math.round(1 / CUADRO_SEG);
const args = process.argv.slice(2);

function opcion(nombre) {
  const i = args.indexOf(nombre);
  return i >= 0 ? args[i + 1] : undefined;
}

function numero(nombre, porDefecto) {
  const texto = opcion(nombre);
  if (texto === undefined) return porDefecto;
  const n = Number(texto);
  if (!Number.isInteger(n) || n < 1) {
    console.error(`${nombre} pide un entero positivo, y llegó «${texto}»`);
    process.exit(1);
  }
  return n;
}

const opciones = {
  cuadrosPorJugada: numero('--cuadros', CUADROS_POR_JUGADA),
  holgura: numero('--holgura', HOLGURA),
  tope: numero('--tope', TOPE_TOLERANCIA),
  maxNodos: numero('--nodos', 150_000),
  cambios: args.includes('--libres') ? 'libres' : 'en-hitos',
};

/* -----------------------------------------------------------------------------------------
   Lo que se lee
   ----------------------------------------------------------------------------------------- */

const banco = JSON.parse(readFileSync(BANCO, 'utf-8'));
const problemas = problemasDelBanco(banco);
if (problemas.length > 0) {
  console.error(`El banco no está sano (CTR-16.5), y un nivel mal dibujado no se resuelve:\n  ${problemas.join('\n  ')}`);
  process.exit(1);
}

/** El archivo de soluciones, o uno vacío si todavía no existe. */
function leerSoluciones() {
  if (!existsSync(SOLUCIONES)) {
    return { contrato: 'CTR-18', contratoVersion: 1, juego: 'skayboy', actualizado: hoy(), cuadrosPorSegundo: CUADROS_POR_SEGUNDO, soluciones: {} };
  }
  try {
    return JSON.parse(readFileSync(SOLUCIONES, 'utf-8'));
  } catch (error) {
    console.error(`${SOLUCIONES} no es un JSON que se pueda leer: ${error.message}`);
    process.exit(1);
  }
}

function hoy() {
  const d = new Date();
  const dos = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

const archivo = leerSoluciones();
// Si las trazas están en otra unidad que el mundo, ninguna se puede jugar: se tratan como si no
// estuvieran, y la única salida es buscarlas todas de nuevo (`CTR-18.2`).
const unidad = problemaDeUnidad(archivo.cuadrosPorSegundo);
if (unidad !== null) console.log(`Ojo: ${unidad}.`);
const grabadas = unidad === null ? (archivo.soluciones ?? {}) : {};
const renglonesDe = (id) => (Array.isArray(grabadas[id]?.deUno) ? grabadas[id].deUno : undefined);

/* -----------------------------------------------------------------------------------------
   Cómo se muestra
   ----------------------------------------------------------------------------------------- */

const coma = (n, decimales = 2) => n.toFixed(decimales).replace('.', ',');
const ms = (n) => `${Math.round(n)} ms`;
const segundos = (cuadros) => `${coma(cuadros / CUADROS_POR_SEGUNDO)} s`;

function teclas(m) {
  return [m.izquierda && 'izq', m.derecha && 'der', m.saltar && 'salto'].filter(Boolean).join('+');
}

function describir(mandos) {
  const partes = ['skayboy', 'poligirl']
    .map((id) => (teclas(mandos[id]) ? `${id} ${teclas(mandos[id])}` : null))
    .filter(Boolean);
  return partes.length > 0 ? partes.join(' · ') : '(nadie toca nada)';
}

/** La traza en renglones de `CTR-18.3`, y al lado qué quiere decir cada uno. */
function mostrarTraza(traza, deUno) {
  let cuadro = 0;
  const renglones = deUno ? escribirTraza(traza) : null;
  traza.forEach((corrida, i) => {
    const renglon = renglones === null ? '' : `«${renglones[i]}»`.padEnd(12);
    console.log(`      ${renglon}desde ${String(cuadro).padStart(4)}  ${String(corrida.cuadros).padStart(4)} cuadros  ${describir(corrida.mandos)}`);
    cuadro += corrida.cuadros;
  });
}

/**
 * Un borde en el cuadro 0 no se puede adelantar: no hay cuadros antes de que empiece la
 * partida (`CTR-18.7` punto 3), así que su "antes" es el tope por vacío, no un margen. Se dice
 * así, para que nadie lea 60 como que el pulgar puede llegar un segundo antes.
 */
function describirBorde(b) {
  const tecla = b.tecla === 'saltar' ? 'salto' : b.tecla;
  const antes = b.cuadro === 0 ? 'antes no aplica (cuadro 0)' : `aguanta ${b.antes} antes`;
  const despues = b.cuadro === 0 ? `aguanta ${b.despues} después` : `${b.despues} después`;
  return `${b.columna} ${tecla}, cuadro ${b.cuadro} (${b.sentido}): ${antes} y ${despues}`;
}

const numeroDeTolerancia = (t) => (t.minimo >= t.tope ? `≥ ${t.tope}` : String(t.minimo));

function mostrarTolerancia(t, minimo) {
  const vara = minimo === undefined ? '' : ` · BR-29 pide ≥ ${minimo} para su escalón: ${t.minimo >= minimo ? 'cumple' : 'NO CUMPLE'}`;
  if (t.minimo >= t.tope) {
    console.log(`    Tolerancia: ≥ ${t.tope} cuadros: ninguno de los ${t.bordes.length} bordes pierde antes del tope${vara}`);
    return;
  }
  console.log(`    Tolerancia: ${t.minimo} cuadro(s)${vara}. El borde más apretado: ${describirBorde(t.masApretado)}`);
}

function mostrarSolucion(titulo, s, minimo) {
  const metodo =
    s.metodo === 'busqueda'
      ? ''
      : ` (${s.metodo === 'solape' ? 'la de uno con los turnos solapados' : 'búsqueda con las dos columnas'}; se mide, no se graba)`;
  // La duración de una traza es su largo en cuadros sobre 60 (`CTR-18.5` punto 6), no el reloj
  // del mundo, que se congela a mitad del último cuadro.
  console.log(`  ${titulo}${metodo}: ${segundos(s.cuadros)} (${s.cuadros} cuadros) · la más corta, ${segundos(s.minima.cuadros)} (${s.minima.cuadros})`);
  console.log(`    Búsqueda: ${s.explorados} nodos en ${ms(s.msBusqueda)}; con verificación y ensanchado, ${ms(s.ms)}`);
  mostrarTraza(s.traza, s.modo === 'uno');
  mostrarTolerancia(s.tolerancia, minimo);
}

const paridadEnTexto = (p) => `Skayboy → Poligirl ${p.skayboyAPoligirl} · Poligirl → Skayboy ${p.poligirlASkayboy}`;

/* -----------------------------------------------------------------------------------------
   Regrabar
   ----------------------------------------------------------------------------------------- */

/** La duración y la tolerancia exacta de una traza que gana, para el antes y el después. */
function resumen(nivel, traza) {
  const t = tolerancia(banco, nivel, traza, { tope: opciones.tope });
  return `${segundos(largoDe(traza))} (${largoDe(traza)} cuadros), tolerancia ${numeroDeTolerancia(t)}`;
}

/**
 * Lo que queda grabado para un nivel, siguiendo `ADR-09.4` punto 2. Devuelve los renglones
 * nuevos, o `null` si hay que dejar la vieja como está porque no hay con qué reemplazarla.
 */
function regrabar(nivel, forzar) {
  const viejos = renglonesDe(nivel.id);
  const antes = diagnosticar(banco, nivel, viejos);
  const como =
    viejos === undefined
      ? 'sin traza'
      : antes.traza === null
        ? 'no se puede leer'
        : antes.repeticion?.gana === true
          ? resumen(nivel, antes.traza)
          : 'no gana';
  console.log(`\n${nivel.id} · escalón ${nivel.escalon} · ${nivel.estado}`);
  console.log(`  Antes: ${como}`);
  for (const p of antes.problemas) console.log(`    ${p}`);

  if (!forzar && antes.problemas.length === 0) {
    console.log('  Sigue valiendo: no se toca. (Con --buscar se busca otra igual.)');
    return viejos;
  }

  const r = antes.repeticion;
  if (!forzar && r !== null && r.gana && r.sobrantes > 0) {
    const recortada = escribirTraza(recortar(antes.traza, r.cuadros));
    const despues = diagnosticar(banco, nivel, recortada);
    if (despues.problemas.length === 0) {
      console.log(`  Ganaba antes de su último cuadro: recortada de ${largoDe(antes.traza)} a ${r.cuadros} cuadros.`);
      console.log(`  Después: ${resumen(nivel, despues.traza)}`);
      return recortada;
    }
    console.log('  Recortada no alcanza:');
    for (const p of despues.problemas) console.log(`    ${p}`);
  }

  console.log('  Se busca de nuevo.');
  const s = resolverSolo(banco, nivel, opciones);
  if (s.tipo !== 'solucion') {
    console.log(`  SIN SOLUCIÓN (${s.motivo}) · ${s.explorados} nodos en ${ms(s.ms)}: la traza vieja no se toca.`);
    return null;
  }
  const nuevos = escribirTraza(s.traza);
  const despues = diagnosticar(banco, nivel, nuevos);
  console.log(`  Después: ${resumen(nivel, s.traza)} · la más corta, ${segundos(s.minima.cuadros)} (${s.minima.cuadros})`);
  mostrarTraza(s.traza, true);
  if (despues.problemas.length > 0) {
    console.log('  Grabada, pero el test la va a marcar:');
    for (const p of despues.problemas) console.log(`    ${p}`);
  }
  return nuevos;
}

function escribirSoluciones(soluciones) {
  const ordenadas = Object.fromEntries(
    Object.entries(soluciones)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, deUno]) => [id, { deUno }]),
  );
  const cuerpo = (actualizado) =>
    JSON.stringify(
      { contrato: 'CTR-18', contratoVersion: 1, juego: 'skayboy', actualizado, cuadrosPorSegundo: CUADROS_POR_SEGUNDO, soluciones: ordenadas },
      null,
      2,
    ) + '\n';
  const viejo = existsSync(SOLUCIONES) ? readFileSync(SOLUCIONES, 'utf-8') : null;
  // `actualizado` cambia solo si cambió algo más (CTR-18.2).
  if (viejo !== null && viejo === cuerpo(archivo.actualizado)) {
    console.log(`\n${SOLUCIONES}: sin cambios.`);
    return;
  }
  writeFileSync(SOLUCIONES, cuerpo(hoy()));
  console.log(`\n${SOLUCIONES}: escrito.`);
}

if (args.includes('--regrabar')) {
  const siguiente = args[args.indexOf('--regrabar') + 1];
  const pedido = /^NIV-\d{2}$/.test(siguiente ?? '') ? siguiente : opcion('--nivel');
  const todos = args.includes('--todos') || siguiente === 'todos';
  const forzar = args.includes('--buscar');
  const enRojo = (nivel) => diagnosticar(banco, nivel, renglonesDe(nivel.id)).problemas.length > 0;
  const elegidos =
    pedido !== undefined ? banco.niveles.filter((n) => n.id === pedido) : todos || forzar ? banco.niveles : banco.niveles.filter(enRojo);
  if (pedido !== undefined && elegidos.length === 0) {
    console.error(`No hay ningún nivel ${pedido} en ${BANCO}. Están: ${banco.niveles.map((n) => n.id).join(', ')}`);
    process.exit(1);
  }

  console.log(
    `Regrabando ${elegidos.length} de ${banco.niveles.length} nivel(es)` +
      (pedido !== undefined ? '' : todos || forzar ? ' (todos)' : ' (los que están en rojo)') +
      (forzar ? ' · buscando de nuevo aunque valgan' : '') +
      ` · jugadas de ${opciones.cuadrosPorJugada} cuadros · se ensancha hasta ${opciones.holgura}`,
  );
  const soluciones = Object.fromEntries(
    Object.entries(grabadas).map(([id, s]) => [id, s.deUno]),
  );
  let sinSolucion = 0;
  for (const nivel of elegidos) {
    const renglones = regrabar(nivel, forzar);
    if (renglones === null) sinSolucion++;
    else if (renglones !== undefined) soluciones[nivel.id] = renglones;
  }
  // Una traza de un nivel que ya no existe es la mitad de la regla 1 de CTR-18.6 en rojo: se va,
  // salvo que se haya pedido un nivel solo.
  if (pedido === undefined) {
    for (const id of Object.keys(soluciones)) {
      if (banco.niveles.some((n) => n.id === id)) continue;
      console.log(`\n${id}: hay traza y no hay nivel. Se borra la traza.`);
      delete soluciones[id];
    }
  }
  escribirSoluciones(soluciones);
  if (sinSolucion > 0) {
    console.error(`\n${sinSolucion} nivel(es) sin la de uno con la física de hoy: se mueve el nivel o se vuelve atrás la constante (ADR-09.4).`);
    process.exit(1);
  }
  process.exit(0);
}

/* -----------------------------------------------------------------------------------------
   Informar
   ----------------------------------------------------------------------------------------- */

const pedido = opcion('--nivel');
const niveles = pedido === undefined ? banco.niveles : banco.niveles.filter((n) => n.id === pedido);
if (niveles.length === 0) {
  console.error(`No hay ningún nivel ${pedido} en ${BANCO}. Están: ${banco.niveles.map((n) => n.id).join(', ')}`);
  process.exit(1);
}

console.log(
  `Resolviendo ${niveles.length} nivel(es) · jugadas de ${opciones.cuadrosPorJugada} cuadros · ` +
    `se ensancha hasta ${opciones.holgura} y se mide hasta ${opciones.tope} · cambios ${opciones.cambios} · ` +
    `presupuesto ${opciones.maxNodos} nodos`,
);

const filas = [];
let enRojo = 0;
for (const nivel of niveles) {
  const minimo = toleranciaMinima(nivel.escalon);
  console.log(`\n${nivel.id} · escalón ${nivel.escalon} · ${nivel.estado}${nivel.nombre ? ` · «${nivel.nombre}»` : ' · sin nombre todavía'}`);
  const t0 = performance.now();

  // La grabada: lo que el test repite en cada build.
  const grabada = diagnosticar(banco, nivel, renglonesDe(nivel.id));
  let deLaGrabada = null;
  if (grabada.problemas.length > 0) {
    enRojo++;
    console.log('  La grabada: EN ROJO');
    for (const p of grabada.problemas) console.log(`    ${p}`);
  } else {
    const t = tolerancia(banco, nivel, grabada.traza, { tope: opciones.tope });
    deLaGrabada = { cuadros: largoDe(grabada.traza), tolerancia: t, paridad: grabada.repeticion.paridad };
    console.log(`  La grabada: ${segundos(deLaGrabada.cuadros)} (${deLaGrabada.cuadros} cuadros) · ${paridadEnTexto(deLaGrabada.paridad)}`);
    mostrarTraza(grabada.traza, true);
    mostrarTolerancia(t, minimo);
  }

  // La búsqueda: lo que la máquina encuentra hoy, y el piso de cuánto dura el nivel.
  const uno = resolverSolo(banco, nivel, opciones);
  if (uno.tipo === 'solucion') mostrarSolucion('De uno, buscada ahora', uno, minimo);
  else {
    enRojo++;
    console.log(`  De uno: SIN SOLUCIÓN (${uno.motivo}) · ${uno.explorados} nodos en ${ms(uno.ms)}`);
  }
  const dos = resolverDeADos(banco, nivel, { ...opciones, deUno: uno });
  if (dos.tipo === 'solucion') mostrarSolucion('De a dos', dos);
  else console.log(`  De a dos: SIN SOLUCIÓN (${dos.motivo}) · ${dos.explorados} nodos en ${ms(dos.ms)}`);
  filas.push({ nivel, minimo, deLaGrabada, uno, dos, ms: performance.now() - t0 });
}

console.log('\nNivel    Grabada          Tolerancia (BR-29)   Más corta de uno   De a dos   Paridad S→P/P→S   Nodos   Tiempo');
for (const { nivel, minimo, deLaGrabada, uno, dos, ms: total } of filas) {
  const g = deLaGrabada;
  const grabadaTexto = g === null ? 'EN ROJO' : `${segundos(g.cuadros)} (${g.cuadros})`;
  const tol = g === null ? '—' : `${numeroDeTolerancia(g.tolerancia)} (≥ ${minimo})`;
  const corta = uno.tipo === 'solucion' ? segundos(uno.minima.cuadros) : 'no';
  const aDos = dos.tipo === 'solucion' ? segundos(dos.minima.cuadros) : 'no';
  const par = g === null ? '—' : `${g.paridad.skayboyAPoligirl} / ${g.paridad.poligirlASkayboy}`;
  console.log(
    `${nivel.id.padEnd(8)} ${grabadaTexto.padEnd(16)} ${tol.padEnd(20)} ${corta.padEnd(18)} ${aDos.padEnd(10)} ${par.padEnd(17)} ${String(uno.explorados).padEnd(7)} ${ms(total)}`,
  );
}

const porEscalon = [1, 2, 3].map((e) => `${e} → ${banco.niveles.filter((n) => n.escalon === e).length}`);
console.log(`\nEscalones del banco: ${porEscalon.join(' · ')}`);
const pares = filas.filter((f) => f.deLaGrabada !== null).map((f) => f.deLaGrabada.paridad);
const total = sumarParidad(pares);
const paridad = problemaDeParidad(total);
console.log(`Paridad sobre las trazas grabadas: ${paridadEnTexto(total)} · ${paridad === null ? 'diferencia ≤ 1 (BR-23.1)' : paridad}`);
if (pedido !== undefined) console.log('(Es la paridad de un nivel solo: la de BR-23.1 se cuenta sobre el banco entero.)');

if (enRojo > 0 || (paridad !== null && pedido === undefined)) {
  console.error(
    `\n${enRojo} cosa(s) en rojo${paridad !== null && pedido === undefined ? ', y la paridad' : ''}. ` +
      'Una traza que no vale se regraba con --regrabar; un nivel sin la de uno no cuenta para el piso (BR-25 b).',
  );
  process.exit(1);
}
