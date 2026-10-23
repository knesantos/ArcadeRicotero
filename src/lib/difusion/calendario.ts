/**
 * El calendario de las redes (`D-81`): qué sale, cuándo, en qué red y con qué pieza.
 *
 * Lo escribe `difusion` en `Docs/DIFUSION/calendario.json`; lo leen `scripts/redes.mjs`
 * (que imprime las piezas y arma el lote para la cola) y los tests. Acá vive solo la
 * forma y las reglas que se pueden mirar a máquina; la voz la audita `voz.test.ts`, con
 * los mismos patrones que el resto del sitio.
 */

export const REDES = ['instagram', 'x'] as const;
export type Red = (typeof REDES)[number];

/** borrador (lo dejó `difusion`) → aprobado (el usuario dijo que sí en el chat) →
 *  en-cola (cargado en la herramienta) → publicado. `descartado` se queda, como un ID cancelado. */
export const ESTADOS = ['borrador', 'aprobado', 'en-cola', 'publicado', 'descartado'] as const;
export type Estado = (typeof ESTADOS)[number];

/** El disco que viste la pieza (`D-19`): pone el acento y la letra de la firma. */
export const DISCOS = ['oktubre', 'gulp', 'lobo-suelto', 'la-mosca', 'ultimo-bondi'] as const;
export type Disco = (typeof DISCOS)[number];

export interface Pieza {
  readonly disco: Disco;
  /** La línea que canta, en grande. Ocho palabras como techo (voz 4.1). */
  readonly titulo: string;
  /** La que nombra: qué es y dónde se juega. */
  readonly bajada: string;
  /** Una imagen de `public/`, sin la barra inicial (una tapa, un bicho). Opcional. */
  readonly imagen?: string;
}

export interface Posteo {
  readonly id: string;
  /** ISO 8601 con zona: `2026-10-27T19:00:00-03:00`. */
  readonly fecha: string;
  readonly redes: readonly Red[];
  readonly estado: Estado;
  readonly x?: string;
  readonly instagram?: string;
  readonly enlace: string;
  readonly pieza: Pieza;
  /** La descripción de la imagen, para quien no la ve. */
  readonly alt: string;
  /** Las fichas `RES-` que respaldan un dato, si el posteo afirma uno. */
  readonly fuentes?: readonly string[];
  /** Los ids que devolvió Buffer al cargarlo en la cola, por red. Los escribe `redes cola`. */
  readonly buffer?: Partial<Record<Red, string>>;
}

export interface Calendario {
  readonly posteos: readonly Posteo[];
}

export const SITIO = 'https://fichinricotero.com.ar';

/** X cuenta cualquier enlace como 23 caracteres, sea del largo que sea. */
export function largoEnX(texto: string): number {
  const sinEnlaces = texto.replace(/https?:\/\/\S+/g, 'x'.repeat(23));
  return [...sinEnlaces].length;
}

/** Cualquier pictograma: los veta `UX-04` en el sitio y `D-81` en las redes. */
const EMOJI = /\p{Extended_Pictographic}/u;

/** Devuelve la lista de problemas; vacía si el calendario está bien. */
export function validar(cal: Calendario): string[] {
  const malos: string[] = [];
  const vistos = new Set<string>();

  for (const p of cal.posteos) {
    const en = (msg: string): void => void malos.push(`${p.id}: ${msg}`);

    if (!/^DIF-\d{2,}$/.test(p.id)) en('el id tiene que ser DIF-XX');
    if (vistos.has(p.id)) en('id repetido');
    vistos.add(p.id);

    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?[+-]\d{2}:\d{2}$/.test(p.fecha) || Number.isNaN(Date.parse(p.fecha)))
      en(`fecha "${p.fecha}" no es ISO con zona`);
    if (!ESTADOS.includes(p.estado)) en(`estado "${p.estado}" no existe`);
    if (p.redes.length === 0) en('no sale en ninguna red');
    for (const r of p.redes) if (!REDES.includes(r)) en(`red "${r}" no existe`);
    if (!p.enlace.startsWith(SITIO)) en(`el enlace tiene que ser del sitio (${SITIO})`);
    if (!p.alt?.trim()) en('falta la descripción de la imagen (alt)');
    if (!DISCOS.includes(p.pieza?.disco)) en(`disco "${p.pieza?.disco}" no existe`);
    if (!p.pieza?.titulo?.trim()) en('la pieza no tiene título');
    else if (p.pieza.titulo.trim().split(/\s+/).length > 8) en('el título de la pieza pasa de ocho palabras (voz 4.1)');
    if (!p.pieza?.bajada?.trim()) en('la pieza no tiene bajada');
    for (const f of p.fuentes ?? []) if (!/^RES-\d{2,}$/.test(f)) en(`fuente "${f}" no es una ficha RES-`);

    const textos: Array<[string, string | undefined]> = [
      ['título', p.pieza?.titulo],
      ['bajada', p.pieza?.bajada],
    ];

    if (p.redes.includes('x')) {
      if (!p.x?.trim()) en('sale en X y no tiene texto de X');
      else {
        if (largoEnX(p.x) > 280) en(`el texto de X tiene ${largoEnX(p.x)} caracteres (tope 280)`);
        if (/(^|\s)#\w/.test(p.x)) en('en X no van hashtags');
        if (!p.x.includes(p.enlace)) en('el texto de X no lleva el enlace');
      }
      textos.push(['X', p.x]);
    }
    if (p.redes.includes('instagram')) {
      if (!p.instagram?.trim()) en('sale en Instagram y no tiene texto de Instagram');
      else {
        if ([...p.instagram].length > 2200) en('el texto de Instagram pasa de 2200 caracteres');
        if ((p.instagram.match(/(^|\s)#\w/g) ?? []).length > 3) en('en Instagram van hasta tres hashtags');
        // En Instagram un enlace en el texto no se toca: va en la bio.
        if (/https?:\/\//.test(p.instagram)) en('en Instagram el enlace no va en el texto (va en la bio)');
      }
      textos.push(['Instagram', p.instagram]);
    }

    for (const [donde, t] of textos) {
      if (!t) continue;
      if (EMOJI.test(t)) en(`${donde}: lleva emoji`);
      // Solo grita el acierto (voz, sección 7): en las redes no hay acierto que gritar.
      if (/[!¡]/.test(t)) en(`${donde}: lleva signo de exclamación`);
      if (/\.\.\.|…/.test(t) && donde === 'título') en('el título lleva suspensivos');
    }
  }
  return malos;
}

/** Los textos que se leen, para que `voz.test.ts` los pase por los mismos patrones del sitio. */
export function textosVisibles(cal: Calendario): string[] {
  return cal.posteos
    .filter((p) => p.estado !== 'descartado')
    .flatMap((p) => [p.pieza.titulo, p.pieza.bajada, p.x ?? '', p.instagram ?? ''])
    .map((t) => t.replace(/https?:\/\/\S+/g, ''))
    .filter((t) => t.trim());
}
