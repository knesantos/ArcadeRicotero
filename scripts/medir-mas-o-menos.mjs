/**
 * Mide el pozo de "Más o menos" (`US-10`) con los archivos de verdad, para mirarlo a ojo.
 *
 *   npm run medir-mas-o-menos
 *
 * No escribe nada. Imprime cuántas preguntas trae cada familia, y cada palabra del banco con
 * su número, las formas que se contaron, en qué temas aparece y las variantes de tilde que
 * nadie clasificó todavía. Es lo que `contenido` no puede correr (`D-12`) y lo que `revisor`
 * mira para auditar un número sin abrir el cancionero tema por tema.
 *
 * Usa las mismas funciones que la página y que `pozo.test.ts` (`pozoDelSitio`,
 * `variantesSinDeclarar`): si esto dice un número, el juego dice el mismo.
 */

import { pozoDelSitio } from '../src/lib/mas-o-menos/pozo-del-sitio.ts';
import { variantesSinDeclarar } from '../src/lib/mas-o-menos/conteo.ts';

const { isla, fuentes } = pozoDelSitio();

console.log(`Pozo: ${isla.datos.length} preguntas`);
const porFamilia = new Map();
for (const d of isla.datos) porFamilia.set(d.familia, (porFamilia.get(d.familia) ?? 0) + 1);
for (const [familia, n] of porFamilia) console.log(`  ${familia.padEnd(14)} ${n}`);

console.log(
  `\nPalabras (en cuántos temas, sobre ${fuentes.corpus.temas.length} temas con letra de ${fuentes.totalDeTemas}):`,
);
for (const p of fuentes.banco.palabras) {
  const dato = isla.datos.find((d) => d.id === `palabra-${p.id.toLowerCase()}`);
  const sueltas = variantesSinDeclarar(p, fuentes.corpus);
  const numero = dato ? String(dato.valor).padStart(3) : '  —';
  console.log(`  ${p.id} ${p.palabra.padEnd(10)} ${numero}  [${p.estado}]  formas: ${p.formas.join(', ')}`);
  if (sueltas.length > 0) console.log(`         ⚠ variantes sin clasificar: ${sueltas.join(', ')}`);
  if (dato?.temas) console.log(`         ${dato.temas.map((t) => t.titulo).join(' · ')}`);
}
