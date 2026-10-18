/**
 * Lo que necesita la ficha de una bestia y no está en `bestiario.json` (`D-73`): de qué disco y
 * año es su tema, y si el tema tiene recorte para sonar. Se calcula una vez, en el build: lo usan
 * la página del bestiario y las del camino con cruces, con el mismo componente
 * (`components/bestiario/FichaBestia.astro`).
 */

import { tituloDelDisco } from '../letra/discos.ts';
import { indexarFragmentos, type Manifiesto } from '../tema/catalogo.ts';
import { leerTemas, slugDeTitulo } from '../letra/temas.ts';
import manifiesto from '../../data/adivinar-tema.json';
import cancionero from '../../data/cancionero.json';
import type { Bestia } from './mapa.ts';

/** Los temas del cancionero, por slug: título, disco y año para el "Sale en". */
const temas = new Map(cancionero.temas.map((t) => [t.slug, { titulo: t.titulo, disco: t.disco, anio: t.anio }]));
/** Qué temas tienen recorte: los 105 de `RES-20`, como en "En vivo". El slug es el mismo del cancionero. */
const slugs105 = new Set(leerTemas().map((t) => slugDeTitulo(t.titulo)));
export const conAudio: ReadonlySet<string> = new Set(indexarFragmentos(manifiesto as unknown as Manifiesto, slugs105).keys());

export const saleEn = (slug: string): string => {
  const t = temas.get(slug)!;
  return `«${t.titulo}» (${tituloDelDisco(t.disco)}, ${t.anio})`;
};

export const etiquetaRotulo = (c: NonNullable<Bestia['cuenta']>[number]): string =>
  c.rotulo === 'leyenda' ? 'Leyenda' : `Lo contó ${c.quien ?? 'alguien'}`;

/**
 * Lo que dice un bicho en el bocadillo: las dos primeras líneas del verso si entran cortas,
 * para que "¿Cómo no sentirme así" venga con "Si ese perro sigue allí?".
 */
export function loQueDice(b: Bestia, sinTema: string): string {
  if (!b.verso) return sinTema;
  return b.verso.length > 1 && (b.verso[0]! + b.verso[1]!).length <= 70 ? `${b.verso[0]} / ${b.verso[1]}` : b.verso[0]!;
}
