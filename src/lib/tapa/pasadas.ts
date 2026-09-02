/**
 * La estampa: de qué archivos se imprime la tapa de un disco (`ADR-05.4`, `CTR-12`, ciclo 12).
 *
 * ## Qué resuelve
 *
 * "Adiviná el tema" y "Adiviná la tapa" imprimen la tapa que sacaste por pasadas de
 * serigrafía —tinta clara, tinta media, clave— y recién después fijan la foto. Los
 * archivos los produce `scripts/generar-pasadas.mjs` en `public/tapas/pasadas/` y
 * `public/tapas/trasera/`, **por convención de slug**: no hay manifiesto que baje el
 * navegador, no hay campo nuevo en ningún JSON de banco y no se toca ningún schema. Este
 * módulo es esa convención escrita una sola vez, para que las dos islas la lean del mismo
 * lugar.
 *
 * ## Por qué no importa casi nada
 *
 * Corre en el navegador. Lo único que importa es `letra/discos.ts`, que no importa nada
 * (`D-29`, `islas.test.ts`): un disco que no está en esa lista **no tiene estampa**, y
 * todas las funciones lo dicen devolviendo `null` en vez de armar una ruta que va a dar
 * 404. Es el mismo criterio de `paleta.ts` (devuelve `''` ante lo desconocido) y de
 * `arte.ts` (devuelve `null`): un hueco declarado nunca rompe la pantalla.
 *
 * ## El disco en sus propias letras
 *
 * Las fuentes fan que el sitio aloja cubren, verificado glifo por glifo con `fontTools`
 * el 2026-09-01, exactamente tres nombres de disco: **OKTUBRE** en el calco de *Oktubre*
 * (`RES-43`: solo A B C D E I K O R T U) y **LOBO SUELTO** / **CORDERO ATADO** en la
 * digitalización fan de *Lobo suelto* (A–Z, sin tildes ni dígitos). Los otros siete van
 * en `--fuente-rotulada`, con su tilde real (`CNT-14` §2.7, `UX-22` §7): no se inventa una
 * letra que no existe ni se recorta un título para que entre.
 */

import { DISCOS, type Disco } from '../letra/discos.ts';

export type { Disco };

/** Las tres pasadas, en el orden en que se imprimen (`RES-54`): clara, media, clave. */
export const PASADAS = ['clara', 'media', 'clave'] as const;
export type Pasada = (typeof PASADAS)[number];

const esDisco = (slug: string): slug is Disco => (DISCOS as readonly string[]).includes(slug);

/** `/tapas/pasadas/<slug>-<pasada>.png`, o `null` si el slug no es uno de los diez. */
export function rutaPasada(slug: string, pasada: Pasada): string | null {
  return esDisco(slug) ? `/tapas/pasadas/${slug}-${pasada}.png` : null;
}

/** `/tapas/trasera/<slug>.jpg`, o `null`. La otra cara, a 320 px: una ficha más (`ADR-05.6`). */
export function rutaTrasera(slug: string): string | null {
  return esDisco(slug) ? `/tapas/trasera/${slug}.jpg` : null;
}

/** `/tapas/<slug>.jpg`, o `null`. La misma que `arte.ts:tapa()` devuelve en build. */
export function rutaFicha(slug: string): string | null {
  return esDisco(slug) ? `/tapas/${slug}.jpg` : null;
}

/** Las piezas de una estampa, ya como rutas públicas, más cómo se escribe su nombre. */
export interface Estampa {
  readonly slug: Disco;
  /** La foto que se fija al final: la ficha de 320 px que ya existe (`D-21`, forma 3). */
  readonly ficha: string;
  /** Las tres pasadas, en el orden en que se imprimen: clara, media, clave. */
  readonly pasadas: readonly [clara: string, media: string, clave: string];
  /** La trasera real. Se pide recién al dar vuelta (`ADR-05.6`). */
  readonly trasera: string;
  /**
   * La letra propia del disco, si existe: la clase que `juego.css` viste con la fuente
   * fan correspondiente. `null` para los siete que van en la rotulada.
   */
  readonly letra: 'oktubre' | 'lobo-suelto' | null;
  /** El nombre del disco tal como se estampa (`CNT-14` §2.7). */
  readonly nombreEstampado: string;
}

/** Cómo se estampa cada nombre. Mayúsculas siempre; sin tilde SOLO donde la tapa real no la lleva. */
const NOMBRE_ESTAMPADO: Record<Disco, string> = {
  gulp: 'GULP!',
  oktubre: 'OKTUBRE',
  'un-baion-para-el-ojo-idiota': 'UN BAIÓN PARA EL OJO IDIOTA',
  'bang-bang-estas-liquidado': '¡BANG! ¡BANG! ESTÁS LIQUIDADO',
  'la-mosca-y-la-sopa': 'LA MOSCA Y LA SOPA',
  'lobo-suelto': 'LOBO SUELTO',
  'cordero-atado': 'CORDERO ATADO',
  luzbelito: 'LUZBELITO',
  'ultimo-bondi-a-finisterre': 'ÚLTIMO BONDI A FINISTERRE',
  'momo-sampler': 'MOMO SAMPLER',
};

/** Los tres nombres que tienen letra propia. Los demás, `--fuente-rotulada`. */
const LETRA_PROPIA: Partial<Record<Disco, Estampa['letra']>> = {
  oktubre: 'oktubre',
  'lobo-suelto': 'lobo-suelto',
  'cordero-atado': 'lobo-suelto',
};

/**
 * La estampa de un disco, o `null` si el slug no es uno de los diez.
 *
 * Las rutas son convención pura: existen si `scripts/generar-pasadas.mjs` corrió, y
 * `pasadas.test.ts` es quien vigila que existan y que lleven el color medido. Si una
 * faltara igual, el `<img>` cae a su `alt` y la estampa degrada a lo que sí llegó
 * (`ADR-05.5`) — nunca a una pantalla rota.
 */
export function estampaDe(slug: string): Estampa | null {
  if (!esDisco(slug)) return null;
  return {
    slug,
    ficha: rutaFicha(slug)!,
    pasadas: [rutaPasada(slug, 'clara')!, rutaPasada(slug, 'media')!, rutaPasada(slug, 'clave')!],
    trasera: rutaTrasera(slug)!,
    letra: LETRA_PROPIA[slug] ?? null,
    nombreEstampado: NOMBRE_ESTAMPADO[slug],
  };
}

/**
 * El slug de disco escondido en el nombre de un recorte de zoom (`UX-13`): `gulp-zoom` →
 * `gulp`. Es lo que le permite a "Adiviná la tapa" imprimir la tapa entera al acertar sin
 * que el banco lleve un campo nuevo (`ADR-05.4`, `T-206`). Devuelve `null` si el nombre no
 * sigue la convención o el slug no es de los diez.
 */
export function slugDeRecorte(archivo: string): Disco | null {
  const base = archivo.replace(/\.jpg$/, '').replace(/^.*\//, '');
  const slug = base.endsWith('-zoom') ? base.slice(0, -'-zoom'.length) : base;
  return esDisco(slug) ? slug : null;
}
