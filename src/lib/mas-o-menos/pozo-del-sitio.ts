/**
 * El pozo de "Más o menos" con los archivos de verdad (`US-10`).
 *
 * Lee todo lo que `datos.ts` necesita —el banco del juego, `RES-20`, el conteo de
 * setlist.fm, el cancionero— y arma el pozo. Lo usan la página en build y `pozo.test.ts`,
 * con la misma función: así el test prueba el pozo que se publica y no una copia.
 *
 * Usa `node:fs`: corre en build y en Node, nunca en el navegador. Las rutas son relativas
 * a la raíz del repo, igual que las de `letra/temas.ts`.
 */

import { readFileSync } from 'node:fs';
import { leerDiscos, leerDuraciones, leerTemas, slugDeTitulo } from '../letra/temas.ts';
import { TITULO_DEL_DISCO } from '../letra/discos.ts';
import { armarCorpus, type TemaContable } from './conteo.ts';
import { pozoDeLaIsla, type BancoCrudo, type ConteoDeSetlist, type Fuentes, type Plantillas, type PozoDeLaIsla } from './datos.ts';
import { PLANTILLAS } from './copy.ts';

function leerJson<T>(ruta: string): T {
  return JSON.parse(readFileSync(ruta, 'utf-8')) as T;
}

export interface PozoDelSitio {
  /** Lo que viaja a la isla (`CTR-20.8`). */
  readonly isla: PozoDeLaIsla;
  /** Las fuentes con que se armó, para que el test las mire sin volver a leerlas. */
  readonly fuentes: Fuentes;
}

export function leerBanco(ruta = 'src/data/mas-o-menos.json'): BancoCrudo {
  return leerJson<BancoCrudo>(ruta);
}

export function fuentesDelSitio(banco: BancoCrudo = leerBanco()): Fuentes {
  const cancionero = leerJson<{ temas: TemaContable[] }>('src/data/cancionero.json');
  const setlist = leerJson<{ conteo: ConteoDeSetlist }>('src/data/setlistfm.json');
  const temas = leerTemas();
  return {
    banco,
    discos: leerDiscos(),
    titulosDeDisco: TITULO_DEL_DISCO,
    duraciones: leerDuraciones(),
    setlist: setlist.conteo,
    tituloDeSlug: new Map(temas.map((t) => [slugDeTitulo(t.titulo), t.titulo])),
    corpus: armarCorpus(cancionero.temas),
    totalDeTemas: temas.length,
  };
}

export function pozoDelSitio(banco: BancoCrudo = leerBanco(), plantillas: Plantillas = PLANTILLAS): PozoDelSitio {
  const fuentes = fuentesDelSitio(banco);
  return { isla: pozoDeLaIsla(fuentes, plantillas), fuentes };
}
