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
 * Sale de `src/data/por-la-letra-curaduria.json` si existe (etiquetas a mano de
 * `contenido`, `CTR-09.7`); si no, el ítem entra como `sin-clasificar` — bloquear un tema
 * por no tener etiqueta repetiría el pozo de tres ciclos de `US-03`, y defaultear a
 * "media" sería un rótulo que miente.
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
import { repartirPorPopularidad } from '../src/lib/por-la-letra/dificultad.ts';

const CANCIONERO = join('src', 'data', 'cancionero.json');
const POPULARIDAD = join('src', 'data', 'popularidad.json');
const DESTINO = join('src', 'data', 'por-la-letra.json');

const FICHA_POR_SITIO = {
  'letras.com': 'RES-23',
  'cifraclub.com': 'RES-49',
  // lacuerda.net: sin ficha todavia, y su ausencia es la declaracion (CTR-09.6).
};

const cancionero = JSON.parse(readFileSync(CANCIONERO, 'utf-8'));
// `D-27`: la dificultad se infiere de la popularidad, no se etiqueta a mano. Es el
// mismo mecanismo que `BR-18` (f) ya habia fijado para `US-02`.
const popularidad = existsSync(POPULARIDAD)
  ? JSON.parse(readFileSync(POPULARIDAD, 'utf-8'))
  : { temas: [] };
const reparto = repartirPorPopularidad(popularidad.temas ?? []);

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
    // `D-27`. Sin medicion es `dificil`, tal como lo fijo el usuario — y hoy eso es
    // TODOS, porque `popularidad.json` sigue sin la clave de YouTube.
    dificultad: reparto.porSlug.get(tema.slug) ?? 'dificil',
    dificultadSegun: 'youtube',
    fuente: {
      sitio: tema.fuente.sitio,
      url: tema.fuente.url,
      consultado: tema.fuente.consultado,
      ...(ficha ? { ficha } : {}),
    },
  });
}

const banco = {
  contrato: 'CTR-09',
  contratoVersion: 1,
  juego: 'por-la-letra',
  modoRespuesta: 'buscador',
  actualizado: new Date().toISOString().slice(0, 10),
  sensibleA: ['letra'],
  filtro: { regla: 'CNT-11', version: VERSION_FILTRO },
  nota:
    'Lo escribe scripts/generar-por-la-letra.mjs desde el cancionero. Es la lista de ' +
    'lo que existe y valido contra CNT-11, no de deseos. No se edita a mano.',
  items,
};

writeFileSync(DESTINO, `${JSON.stringify(banco, null, 2)}\n`, 'utf-8');

const porDif = {};
for (const i of items) porDif[i.dificultad] = (porDif[i.dificultad] ?? 0) + 1;

console.log(`
  Temas en el banco:   ${items.length} de ${cancionero.temas.length} del cancionero
  Por dificultad:      ${JSON.stringify(porDif)}
  Filtro:              CNT-11 v${VERSION_FILTRO}
  Dificultad:          D-27, desde popularidad (${reparto.medidos} temas medidos de ${(popularidad.temas ?? []).length})
  Descartes:`);
for (const [motivo, n] of [...descartes].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)}  ${motivo}`);
}
if (afuera.length) {
  console.log(`\n  Temas afuera (${afuera.length}):`);
  for (const t of afuera) console.log(`    - ${t}`);
}
console.log(`\n  Piso de US-07: 60. ${items.length >= 60 ? 'CUMPLIDO' : 'NO llega'} con ${items.length}.`);

// El aviso que evita que el tablero diga ✅ sobre un juego que no escalona. `D-27` deja
// la regla puesta, pero sin mediciones la regla devuelve `dificil` para todos.
if (reparto.medidos === 0) {
  console.log(`
  🔴 NINGUN tema tiene medicion de escuchas, asi que TODOS quedaron en 'dificil'
     (D-27: sin escucha es dificil). El juego reparte sin escalonar de verdad, y
     BR-01 no se puede cumplir porque no hay pozo facil del que sacar el primero.

     Un comando lo cambia, y no hay que tocar una linea de codigo:
       YT_API_KEY=... npm run ingerir-popularidad -- --resolver
`);
} else {
  console.log('');
}
