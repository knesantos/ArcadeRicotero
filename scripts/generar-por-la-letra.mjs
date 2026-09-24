/**
 * Genera el banco de "Sacalo por la letra" (`US-07`, `CTR-09`) desde el cancionero.
 *
 *   npm run generar-por-la-letra
 *
 * ## Qué hace
 *
 * Por cada tema con letra del cancionero: arma la lista de versos utilizables (el filtro
 * de `CNT-11`, que vive en `src/lib/por-la-letra/filtro.ts`), le saca los que delatan el
 * título, elige la ventana de ocho que abre la escalera, y la re-verifica entera con
 * `ventanaValida()`. Lo que no llega a ocho versos limpios queda afuera **con el motivo
 * escrito** — el banco es la lista de lo que existe y validó, no de deseos (`CTR-09`).
 *
 * ## La dificultad
 *
 * **No la escribe nadie**: sale de lo más tocado en vivo (`D-46`, `CTR-09.7` enmendado).
 * Con los ítems ya armados, el pozo son sus slugs, y `repartirEnTercios()`
 * (`src/lib/en-vivo.ts`, `CTR-19.15`) los parte en tercios con el conteo citado de
 * `src/data/setlistfm.json`. Un tema sin línea en el conteo es `dificil` (`D-27`) y queda
 * marcado `sin-conteo`. El banco guarda la ficha y la fecha del conteo que usó: si el conteo
 * se refresca y esto no se vuelve a correr, `banco.test.ts` (t14) se pone en rojo.
 *
 * Si falta `setlistfm.json` o no trae `conteo`, **aborta**: el conteo está commiteado, y que
 * falte es un repo roto, no un dato que todavía no llegó (`CTR-09.7`).
 *
 * ## A diferencia de `generar-letra.mjs`, acá lacuerda.net SÍ entra
 *
 * `CTR-09.6`: el ítem de este juego no afirma nada sobre la obra — afirma quién
 * transcribió, y eso lo dice el campo `fuente` con el sitio y la URL. La ficha `RES-XX`
 * va cuando existe (cifraclub `RES-49`, letras.com `RES-23`); su ausencia en lacuerda.net
 * es la declaración (`D-14`).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  versosUtilizables,
  elegirVentana,
  ventanaValida,
  VERSION_FILTRO,
} from '../src/lib/por-la-letra/filtro.ts';
import { repartirEnTercios } from '../src/lib/en-vivo.ts';

const CANCIONERO = join('src', 'data', 'cancionero.json');
const CONTEO = join('src', 'data', 'setlistfm.json');
const DESTINO = join('src', 'data', 'por-la-letra.json');

/** El piso de `US-07` y su cuota de Fáciles (`PRD-adivinar-por-la-letra.md`). Se miden, no se fuerzan. */
const PISO = 60;
const CUOTA_FACILES = 15;

const FICHA_POR_SITIO = {
  'letras.com': 'RES-23',
  'cifraclub.com': 'RES-49',
  // lacuerda.net: sin ficha todavia, y su ausencia es la declaracion (CTR-09.6).
};

const cancionero = JSON.parse(readFileSync(CANCIONERO, 'utf-8'));

// Paso 1 de `CTR-09.7`: el conteo citado, o nada se genera.
const conteo = existsSync(CONTEO) ? JSON.parse(readFileSync(CONTEO, 'utf-8')).conteo : undefined;
if (!conteo || !Array.isArray(conteo.temas)) {
  console.error(`
  ${CONTEO} no existe o no trae el bloque "conteo". La dificultad de US-07 sale de ahi
  (D-46, CTR-09.7), y el archivo esta commiteado: si falta, el repo esta roto.
  No se genera un banco todo en "dificil" para taparlo.
`);
  process.exit(1);
}

const items = [];
const descartes = new Map(); // motivo -> cuantos
const afuera = [];

function anotarDescarte(motivo) {
  descartes.set(motivo, (descartes.get(motivo) ?? 0) + 1);
}

for (const tema of cancionero.temas) {
  if (tema.contenido !== 'letra') {
    anotarDescarte(`sin letra (${tema.contenido})`);
    continue;
  }

  // Las lineas de letra del tema, en orden, con el tipo de su seccion.
  const lineas = [];
  for (const seccion of tema.secciones) {
    for (const linea of seccion.lineas) {
      if (linea.t === 'letra' && linea.texto?.trim()) {
        lineas.push({ texto: linea.texto, seccion: seccion.tipo });
      }
    }
  }

  const utilizables = versosUtilizables(lineas);
  const ventana = elegirVentana(utilizables, tema.titulo);
  if (!ventana) {
    anotarDescarte('menos de 8 versos limpios sin el titulo');
    afuera.push(`${tema.slug} (${utilizables.length} utilizables)`);
    continue;
  }

  const motivo = ventanaValida(ventana.versos, { slug: tema.slug, titulo: tema.titulo });
  if (motivo) {
    // No deberia pasar: elegirVentana ya filtro. Si pasa, es un bug del filtro y es
    // mejor un banco mas chico que un enunciado con ruido.
    anotarDescarte(`ventanaValida rechazo: ${motivo}`);
    afuera.push(`${tema.slug} (${motivo})`);
    continue;
  }

  const ficha = FICHA_POR_SITIO[tema.fuente.sitio];
  items.push({
    slug: tema.slug,
    titulo: tema.titulo,
    desde: ventana.desde,
    versos: ventana.versos.map((v) => v.texto),
    // Paso 3: el item se arma sin nivel. Lo pone el paso 5, cuando ya se sabe cual es el pozo.
    dificultad: null,
    dificultadSegun: null,
    fuente: {
      sitio: tema.fuente.sitio,
      url: tema.fuente.url,
      consultado: tema.fuente.consultado,
      ...(ficha ? { ficha } : {}),
    },
  });
}

// Paso 4: el pozo son los temas que quedaron, no el catalogo entero (`BR-30`, `CTR-07.8` p. 2).
const tercios = repartirEnTercios(new Set(items.map((i) => i.slug)), conteo);
const sinConteo = new Set(tercios.sinConteo);

// Paso 5.
for (const i of items) {
  i.dificultad = tercios.porSlug.get(i.slug);
  i.dificultadSegun = sinConteo.has(i.slug) ? 'sin-conteo' : 'en-vivo';
}

// Paso 6.
const banco = {
  contrato: 'CTR-09',
  contratoVersion: 2,
  juego: 'por-la-letra',
  modoRespuesta: 'buscador',
  actualizado: new Date().toISOString().slice(0, 10),
  sensibleA: ['letra'],
  filtro: { regla: 'CNT-11', version: VERSION_FILTRO },
  conteo: { ficha: conteo.ficha, consultado: conteo.consultado },
  nota:
    'Lo escribe scripts/generar-por-la-letra.mjs desde el cancionero. Es la lista de ' +
    'lo que existe y valido contra CNT-11, no de deseos. No se edita a mano.',
  items,
};

writeFileSync(DESTINO, `${JSON.stringify(banco, null, 2)}\n`, 'utf-8');

// Paso 7: lo que salio, medido contra el piso y la cuota de `US-07`.
const { facil, media, dificil } = tercios.porNivel;
const titulo = new Map(items.map((i) => [i.slug, i.titulo]));

console.log(`
  Temas en el banco:   ${items.length} de ${cancionero.temas.length} del cancionero
  Por dificultad:      ${facil} Facil · ${media} Media · ${dificil} Dificil
  Con conteo:          ${tercios.conConteo} de ${items.length} (tercios de D-27 sobre ellos, CTR-19.15)
  Conteo:              ${conteo.ficha}, consultado el ${conteo.consultado}
  Filtro:              CNT-11 v${VERSION_FILTRO}
  Descartes:`);
for (const [motivo, n] of [...descartes].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)}  ${motivo}`);
}
if (afuera.length) {
  console.log(`
  Temas afuera (${afuera.length}):`);
  for (const t of afuera) console.log(`    - ${t}`);
}
if (tercios.sinConteo.length) {
  console.log(`
  Sin conteo, en Dificil por D-27 (${tercios.sinConteo.length}):`);
  for (const s of tercios.sinConteo) console.log(`    - ${titulo.get(s)}`);
}
console.log(`
  Piso de US-07: ${PISO}. ${items.length >= PISO ? 'CUMPLIDO' : 'NO llega'} con ${items.length}.`);
// La cuota es de `producto`: se mide y se avisa, no se aborta (`CTR-09.7` paso 7).
const rojo = (t) => `\u001b[31m${t}\u001b[0m`;
const cuota = `Cuota de Faciles de US-07: ${CUOTA_FACILES}. ${facil >= CUOTA_FACILES ? 'CUMPLIDA' : 'NO llega'} con ${facil}.`;
console.log(`  ${facil >= CUOTA_FACILES ? cuota : rojo(cuota)}
`);
