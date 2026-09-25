/**
 * El auditor de paleta del área de juego.
 *
 *   node scripts/auditar-paleta-pixel.mjs
 *
 * Es el comando que `UX-27 §5.3` y `§10` dejaron escrito antes de que existiera, y la otra
 * mitad de `T-268` (ciclo 16; era `T-243` del ciclo 15). Barre `public/sprites/*.png`
 * (`CTR-15.5`: la carpeta es esa y no `public/arte/pixel/`) y sale con 1 ante cualquiera de
 * estas cosas, nombrando archivo, coordenada y color:
 *
 * - **Un píxel con alfa que no es 0 ni 255** (`UX-27 §3`, `CTR-15.4`).
 * - **Un píxel opaco que no es ninguna de las tintas `--px-*` de `tokens.css`.** Las de
 *   toda el área, no las de un atlas (`FIND-60`): es la tinta diecisiete, que no existe.
 * - **El archivo no es PNG-32 limpio**: RGBA de 8 bits, sin entrelazar, y con `IHDR`,
 *   `IDAT` e `IEND` y nada más — sin perfil ICC ni metadatos (`UX-27 §3`).
 * - **El PNG no se llama `<pieza>.v<N>.png`** (`CTR-15.8`: la versión va en el nombre).
 * - **Un tile con un píxel transparente** adentro de un cuadro que su JSON declara: los
 *   tiles van opacos enteros, el alfa es de los personajes (`UX-27 §3`). La celda que sobra
 *   a la derecha de un estado más corto no es de ningún cuadro y queda vacía.
 * - **El JSON de al lado** falta, o no cumple `CTR-15.7`: sin `contrato: "CTR-15"` o sin
 *   `contratoVersion: 1`; sin `pieza`, o con una que no es el nombre del PNG sin la
 *   versión; sin celda, con una celda que no es de `CTR-15.3` o con un PNG que no es
 *   múltiplo de ella; un personaje sin la caja de 10 × 20 o sin sus seis animaciones (un `.v1` de antes de
 *   `D-47` pasa con las cinco de entonces, hasta que nada lo pida); sin
 *   `animaciones`, con una que no trae fila, cuadros, porSegundo y repite, con una fila o
 *   más cuadros que los que el PNG tiene, dos en la misma fila, o varios cuadros con
 *   `porSegundo: 0`; una paleta que nombra algo que no es un `--px-*` o un `--px-*` que la
 *   hoja no tiene (`CTR-15.4`), o el PNG usa una tinta que su JSON no declara.
 * - **La hoja misma**: una `--px-*` que no resuelve a un hex, más de 16 (`CTR-15.4`), o
 *   una tinta cuyo alias pasa por una variable declarada dos veces con valores distintos
 *   (un `--fondo` redefinido adentro de una `@media`, con `;` o sin él al cerrar el
 *   bloque): no hay cómo saber cuál manda.
 *
 * El hex de cada tinta se resuelve al correr contra `src/styles/tokens.css`, siguiendo alias
 * (`--px-clave: var(--fondo)`, `UX-27 §4`). Este archivo no tiene ni un hex.
 *
 * Con `public/sprites/` vacía o inexistente sale 0: no hay nada que auditar. Hoy, el
 * 2026-09-22, es el caso: la carpeta no existe y `tokens.css` tiene 0 tintas `--px-*`.
 *
 * Trabaja sobre el directorio actual (la raíz del repo), igual que los otros scripts. La
 * lógica vive en `src/lib/pixel/auditoria.ts`; acá solo se lee el disco y se decodifica.
 */

import sharp from 'sharp';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { paletaDelArea } from '../src/lib/pixel/tokens.ts';
import { auditarCabecera, auditarJson, auditarPixeles, contar, leerCabecera } from '../src/lib/pixel/auditoria.ts';

const SPRITES = join('public', 'sprites');
const TOKENS = join('src', 'styles', 'tokens.css');

const pngs = existsSync(SPRITES)
  ? readdirSync(SPRITES).filter((f) => f.toLowerCase().endsWith('.png')).sort()
  : [];
if (pngs.length === 0) {
  console.log('No hay sprites que auditar: public/sprites/ no tiene ningún PNG.');
  process.exit(0);
}

/** Archivo → violaciones. */
const informe = new Map();
const anotar = (archivo, lista) => {
  if (lista.length) informe.set(archivo, [...(informe.get(archivo) ?? []), ...lista]);
};

if (!existsSync(TOKENS)) {
  console.error(`No encuentro ${TOKENS}: sin la hoja no hay contra qué auditar.`);
  process.exit(1);
}
const { tintas, errores } = paletaDelArea(readFileSync(TOKENS, 'utf-8'));
anotar('src/styles/tokens.css', errores);
const permitidos = new Set(tintas.values());

for (const archivo of pngs) {
  const ruta = join(SPRITES, archivo);
  const nombre = `public/sprites/${archivo}`;
  const bytes = readFileSync(ruta);
  let cabecera;
  try {
    cabecera = leerCabecera(bytes);
  } catch (e) {
    anotar(nombre, [e.message]);
    continue;
  }
  anotar(nombre, auditarCabecera(cabecera));
  if (cabecera.profundidad !== 8) {
    // Un PNG de 16 bits se decodificaría a 8 y un alfa de 65280 pasaría por 255.
    continue;
  }
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = new Uint8Array(data);
  const { violaciones, usados } = auditarPixeles(rgba, info.width, info.height, permitidos);
  anotar(nombre, violaciones);
  const rutaJson = ruta.replace(/\.png$/i, '.json');
  const texto = existsSync(rutaJson) ? readFileSync(rutaJson, 'utf-8') : null;
  anotar(nombre, auditarJson(texto, tintas, { ancho: info.width, alto: info.height, archivo, rgba }, usados));
}

const tintasTxt = `${contar(tintas.size, 'tinta', 'tintas')} --px-* en tokens.css`;
if (informe.size === 0) {
  console.log(`${pngs.length === 1 ? 'Auditado' : 'Auditados'} ${pngs.length} PNG contra ${tintasTxt}: todo en regla.`);
  process.exit(0);
}
let total = 0;
for (const [archivo, lista] of informe) {
  console.error(`${archivo}`);
  for (const v of lista) console.error(`  ${v}`);
  total += lista.length;
}
console.error(
  `\nEl auditor rechaza: ${contar(total, 'violación', 'violaciones')} en ${contar(informe.size, 'archivo', 'archivos')} (${tintasTxt}).`,
);
process.exit(1);
