/**
 * El puente entre el collage y los archivos reales de `public/arte/` y `public/tapas/`.
 *
 * El usuario recorta piezas de las tapas (el despiece completo esta en
 * `public/arte/README.md`) y las deja con el nombre acordado. Este modulo corre en
 * build (frontmatter de Astro, no en el navegador): si el recorte ya existe, la
 * pagina lo pega; si todavia no, usa el repuesto dibujado o no muestra nada.
 * Asi ningun hueco del collage rompe la pagina con una imagen quebrada.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
// La lista de los tres articulos de tono grave vive en un modulo hoja que no importa
// nada: la necesitaba una isla (la cama de cinta, `T-191`, que se saco del sitio el
// 2026-10-01) y este archivo arrastra `node:fs`. Ver el comentario de cabecera de `graves.ts`.
import { SLUGS_GRAVES } from './graves.ts';
// Los títulos de los discos, por el mismo motivo: los necesita la isla de la letra.
import { TITULO_DEL_DISCO } from '../letra/discos.ts';

/** URL publica del recorte si ya existe; si no, el repuesto (o nada). */
export function recorte(archivo: string, repuesto: string | null = null): string | null {
  return existsSync(join(process.cwd(), 'public', 'arte', archivo)) ? `/arte/${archivo}` : repuesto;
}

/** La tapa real en baja resolucion (D-04), solo si ya esta generada. */
export function tapa(slug: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', `${slug}.jpg`)) ? `/tapas/${slug}.jpg` : null;
}

/**
 * Las otras dos formas en que una tapa real puede llegar a pantalla (`D-21`, `UX-04`):
 * el detalle recortado y el fondo velado. Los produce `scripts/generar-tapas.mjs` desde
 * los masters; si todavia no se corrio, devuelven null y la pagina no muestra nada — el
 * mismo criterio que los recortes dibujados.
 */
export function detalleTapa(nombre: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', 'detalle', `${nombre}.jpg`))
    ? `/tapas/detalle/${nombre}.jpg`
    : null;
}

export function fondoTapa(nombre: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', 'fondo', `${nombre}.jpg`))
    ? `/tapas/fondo/${nombre}.jpg`
    : null;
}

/**
 * Que fondo de tapa viste cada categoria de la Redondopedia, bajo el mapa de `D-19`: el
 * mismo archivo que ya viste la pantalla de esa parte del sitio (la cabecera de la
 * Redondopedia, "Adiviná el tema", "Completá la letra").
 *
 * Hasta `D-75` esto era `DETALLE_POR_VARIANTE` y daba un recorte chico, flotando junto al
 * titulo. Ahora es la capa de atmosfera de la hoja entera (`lugarDeArticulo`). `discos` no
 * tiene fila: el articulo de un disco se viste con su propia tapa, no con la de la categoria.
 */
export const LUGAR_POR_CATEGORIA: Record<string, string> = {
  mitologia: 'lobo-tiras',
  letras: 'mosca-olla',
  historia: 'gulp-pincelada',
};

/**
 * De que disco sale cada derivado. Existe por la condicion 1 de `D-21`: el credito a
 * Rocambole no alcanza generico, tiene que decir **que tapas se usaron en esa pantalla**.
 * Un fondo no tiene donde poner una firma al lado, asi que la pantalla la junta y la
 * pone en el pie (`UX-04`, mecanismo de credito).
 */
const DISCO_DE: Record<string, string> = {
  /* `oktubre-banderas` —la franja fija del portal— salió el 2026-10-04 (`D-63`): la
     multitud de *Oktubre* pasó a ser el piso del pie, y la acredita el pie mismo. */
  'lobo-tiras': 'Lobo suelto',
  'mosca-olla': 'La mosca y la sopa',
  'bondi-engranajes': 'Último bondi a Finisterre',
  'gulp-pincelada': 'Gulp!',
  'gulp-logo': 'Gulp!',
  /* Va junto con el derivado, no despues: un derivado que llega a pantalla sin su fila
     aca es una tapa que se ve y no se acredita, o sea la condicion 1 de `D-21`
     incumplida en silencio — `discosDe` lo descarta sin decir nada. (El detalle
     `momo-medallon.jpg` salió el 2026-10-01: el casete de Momo pega el recorte de
     `/arte/`, que acredita por `FIGURA_DE_DISCO`.) */
  'bang-bang-estas-liquidado-zoom': '¡Bang! ¡Bang!… Estás liquidado',
  /* `D-49`: los dos detalles que pasaron a vestir casetes del portal. */
  'un-baion-para-el-ojo-idiota-zoom': 'Un baión para el ojo idiota',
  'gulp-zoom': 'Gulp!',
  /* `D-72`: la multitud de cerca viste el casete de "Armá tu recital". */
  'oktubre-zoom': 'Oktubre',
};

/** Los discos que aparecen en una pantalla, sin repetir y en orden de aparicion. */
export function discosDe(nombres: readonly (string | null | undefined)[]): readonly string[] {
  const vistos: string[] = [];
  for (const n of nombres) {
    const d = n ? DISCO_DE[n] : undefined;
    if (d && !vistos.includes(d)) vistos.push(d);
  }
  return vistos;
}

/**
 * Articulos donde el detalle decorativo de tapa NO va, aunque la regla general de
 * `UX-05` (7b) lo habilite. Son los tres que tratan muertes de personas con nombre: un
 * adorno al lado de ese titulo esta fuera de tono. Lo sugirio `experiencia` como llamada
 * de tono sin ficha detras y queda pendiente que lo confirme `contenido`, dueño de
 * `CNT-04` y de `CNT-06`. Mientras tanto rige la opcion conservadora.
 */
export const SIN_DETALLE_POR_TONO = new Set(SLUGS_GRAVES);

/**
 * La capa de atmosfera de un articulo de la Redondopedia (`D-75`): la tapa velada que sube
 * desde arriba de la hoja, detras del titulo, y se acaba antes de que empiece el cuerpo.
 *
 * - **Un disco se viste con su propia tapa**, en el detalle de cerca (`-zoom`): ponerle el
 *   fondo de otro disco confundiria cual es cual, el mismo motivo por el que `UX-05` no le
 *   ponia recorte. Lo acredita el titulo del articulo, que la pagina ya pasa al pie.
 * - **Los demas, con el fondo de su categoria** (`LUGAR_POR_CATEGORIA`).
 * - **Los tres graves, con nada** (`UX-20` §3.4): grano y nada mas, sin velo ni capa.
 *
 * Devuelve la ruta y el nombre del derivado, que es con lo que `discosDe` arma el credito.
 */
export function lugarDeArticulo(
  tipo: string,
  slug: string,
  categoria: string,
): { readonly url: string; readonly nombre: string } | null {
  if (SIN_DETALLE_POR_TONO.has(slug)) return null;
  if (tipo === 'disco') {
    const url = detalleTapa(`${slug}-zoom`);
    return url ? { url, nombre: `${slug}-zoom` } : null;
  }
  const nombre = LUGAR_POR_CATEGORIA[categoria];
  const url = nombre ? fondoTapa(nombre) : null;
  return url && nombre ? { url, nombre } : null;
}

/** Que recorte real reemplaza a cada dibujo de repuesto (ver public/arte/README.md). */
const RECORTE_REAL: Record<string, string> = {
  '/arte/mosca.svg': 'mosca.png',
  '/arte/perro.svg': 'perro.png',
  '/arte/lobo.svg': 'lobo-recortado.png',
};

/** Si el usuario ya pego el recorte real de esta pieza, usarlo; si no, el dibujo. */
export function conRecorteReal(ruta: string): string {
  const real = RECORTE_REAL[ruta];
  return real ? (recorte(real, ruta) as string) : ruta;
}

/* ==================================================================
   El pie de imprenta (ciclo 13)

   La franja con la que termina toda pantalla del sitio. Necesita tres cosas de un disco:
   la pasada que dibuja el fondo de la franja, la figura recortada que la pisa, y el
   titulo con el que el credito de `D-21` lo nombra.
   ================================================================== */

/**
 * La segunda tinta de la serigrafia de ese disco, la que dibuja la franja.
 *
 * **Va la `-media` y nunca la `-clave`**, y las tres razones estan en el CSS de
 * `.pasada-pie`: la clave esta teñida con `--fondo` (no se ve), es la silueta de la
 * composicion ENTERA de una tapa (lo que `public/arte/README.md` prohibe por escrito), y
 * es la carta que el sitio se guarda para el acierto (`D-33`).
 *
 * Devuelve `null` si el taller no corrio todavia: la franja se pinta igual, con la
 * costura y la tinta, que es el mismo criterio de reemplazo del resto del collage.
 */
export function pasadaDeDisco(slug: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', 'pasadas', `${slug}-media.png`))
    ? `/tapas/pasadas/${slug}-media.png`
    : null;
}

/**
 * La figura recortada que pisa la franja de cada disco.
 *
 * Solo los que tienen recorte real puesto; el resto no lleva figura y la franja se
 * sostiene con la costura y la pasada. **Oktubre no tiene, y es a proposito:** la unica
 * calcada que hay de ese disco es la figura encadenada, y esa tiene prohibicion escrita
 * de atribucion de album (`INV-02`, `public/arte/README.md`).
 */
const FIGURA_DE_DISCO: Record<string, string> = {
  'lobo-suelto': 'lobo-recortado.png',
  'cordero-atado': 'cordero-rulo.png',
  luzbelito: 'luzbelito-vela.png',
  'momo-sampler': 'momo-medallon.png',
  'la-mosca-y-la-sopa': 'mosca.png',
  'ultimo-bondi-a-finisterre': 'bondi-interplanetario.png',
};

export function figuraDeDisco(slug: string): string | null {
  const archivo = FIGURA_DE_DISCO[slug];
  return archivo ? recorte(archivo) : null;
}

/**
 * La gente mirando: el piso del pie de imprenta, de borde a borde (`D-63`).
 *
 * Reemplaza a la pasada de ese disco —las dos son el mismo motivo, y la multitud ya trae
 * sus banderas— y la acredita el pie, igual que a la figura. Hoy hay una sola, la de la
 * tapa de *Oktubre*, y la pide solo el portal. La produce `scripts/generar-multitud.mjs`.
 */
const MULTITUD_DE_DISCO: Record<string, string> = {
  oktubre: 'multitud-oktubre.png',
};

export function multitudDeDisco(slug: string): string | null {
  const archivo = MULTITUD_DE_DISCO[slug];
  return archivo ? recorte(archivo) : null;
}

/**
 * Que disco viste cada categoria, escrito con el slug del disco.
 *
 * Es **el mismo mapa de `D-19`** que ya cumple `LUGAR_POR_CATEGORIA` unas lineas mas
 * arriba, dicho en la otra unidad: alla es el nombre del recorte de tapa, aca es el slug
 * del disco. No es un mapa nuevo — si alguno de los dos cambia, cambian los dos.
 */
export const DISCO_DE_CATEGORIA: Record<string, string> = {
  historia: 'gulp',
  discos: 'ultimo-bondi-a-finisterre',
  letras: 'la-mosca-y-la-sopa',
  mitologia: 'lobo-suelto',
  marca: 'oktubre',
  momo: 'momo-sampler',
  bang: 'bang-bang-estas-liquidado',
};

/** Como se llama cada disco cuando el credito de `D-21` lo nombra. Es el mapa de
 *  `letra/discos.ts`, que es el que puede importar el navegador: uno solo, no dos. */
export const TITULO_DE_DISCO: Record<string, string> = TITULO_DEL_DISCO;

/**
 * De qué disco sale un recorte del collage, si sale de uno (`D-21`, condición 1).
 *
 * El pie de cada pantalla ya acredita la figura que pisa su franja; lo que faltaba es que
 * una pantalla que pega recortes **en el contenido** —los casetes del portal— pudiera
 * nombrar sus discos con el mismo mapa, en vez de copiarlo. Se lee al revés de
 * `FIGURA_DE_DISCO`: el archivo manda, y un recorte que no es de ningún disco (el casete
 * dibujado, la figura encadenada sin ficha) devuelve `null` y no acredita nada.
 */
export function discoDeRecorte(ruta: string): string | null {
  // `D-49`: los casetes también pegan tapas enteras y detalles de la foto, no solo recortes.
  // Los tres materiales se reconocen por la carpeta, y cada uno tiene ya su mapa: el slug
  // del disco para la tapa entera, `DISCO_DE` para el detalle.
  const entera = /^\/tapas\/([\w-]+)\.jpg$/.exec(ruta);
  if (entera) return TITULO_DE_DISCO[entera[1]!] ?? null;
  const detalle = /^\/tapas\/detalle\/([\w-]+)\.jpg$/.exec(ruta);
  if (detalle) return DISCO_DE[detalle[1]!] ?? null;

  const archivo = ruta.split('/').pop();
  const slug = Object.keys(FIGURA_DE_DISCO).find((s) => FIGURA_DE_DISCO[s] === archivo);
  return slug ? (TITULO_DE_DISCO[slug] ?? null) : null;
}

/** Qué material es la pieza de un casete: decide cómo se pega (`sitio.css`, `D-49`). */
export type MaterialDeCasete = 'entera' | 'detalle' | 'recorte';

export function materialDeCasete(ruta: string): MaterialDeCasete {
  if (/^\/tapas\/detalle\//.test(ruta)) return 'detalle';
  if (/^\/tapas\//.test(ruta)) return 'entera';
  return 'recorte';
}

/**
 * La pieza que el casete muestra de verdad.
 *
 * Un recorte pasa por `conRecorteReal`, como siempre. Una tapa o un detalle los genera
 * `scripts/generar-tapas.mjs`: si el archivo no está, el casete cae al dibujo de repuesto en
 * vez de pegar una imagen rota — el mismo criterio que el resto del collage. Que eso no pase
 * en el portal publicado lo vigila `portal.test.ts`, que pide el archivo en disco.
 */
export function arteDeCasete(ruta: string): string {
  if (materialDeCasete(ruta) === 'recorte') return conRecorteReal(ruta);
  return existsSync(join(process.cwd(), 'public', ruta.replace(/^\//, ''))) ? ruta : '/arte/casete.svg';
}

/**
 * Las medidas reales de una pieza del collage, leidas del archivo en build.
 *
 * Existe para que un `<img>` pueda declarar `width` y `height` sin que nadie copie un
 * numero a mano. Importa mas de lo que parece: el navegador usa esas dos medidas solo
 * para sacar la proporcion, y si la proporcion no es la del archivo, **la imagen sale
 * estirada**. Como acá el recorte real reemplaza al dibujo de repuesto cuando aparece
 * (`conRecorteReal`), la pieza que se muestra puede cambiar sin que nadie toque el
 * marcado — y con ella la proporcion. Medirla es la unica forma de no mentir.
 *
 * Devuelve `null` si no puede leerla, y entonces la pagina no declara medidas: mejor sin
 * dato que con uno inventado.
 */
export function medidas(rutaPublica: string): { ancho: number; alto: number } | null {
  const archivo = join(process.cwd(), 'public', rutaPublica.replace(/^\//, ''));
  if (!existsSync(archivo)) return null;
  const b = readFileSync(archivo);

  // PNG: el bloque IHDR arranca siempre en el byte 16.
  if (b.length > 24 && b.toString('ascii', 1, 4) === 'PNG') {
    return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
  }

  // JPEG: hay que recorrer los marcadores hasta el SOF, que es el que trae las medidas.
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let p = 2;
    while (p + 9 < b.length) {
      if (b[p] !== 0xff) { p++; continue; }
      const marca = b[p + 1]!;
      // SOF0..SOF15, salteando los cuatro que no describen una imagen.
      if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
        return { alto: b.readUInt16BE(p + 5), ancho: b.readUInt16BE(p + 7) };
      }
      p += 2 + b.readUInt16BE(p + 2);
    }
    return null;
  }

  // SVG: primero los atributos, y si no estan, la caja de dibujo.
  const texto = b.toString('utf-8', 0, 1024);
  const w = /\bwidth="([\d.]+)/.exec(texto);
  const h = /\bheight="([\d.]+)/.exec(texto);
  if (w && h) return { ancho: Math.round(+w[1]!), alto: Math.round(+h[1]!) };
  const caja = /viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/.exec(texto);
  if (caja) return { ancho: Math.round(+caja[1]!), alto: Math.round(+caja[2]!) };
  return null;
}

/**
 * Que pieza del despiece decora la ficha de cada disco en la Redondopedia.
 *
 * **Tres de estas empezaron a verse el 2026-09-02**, cuando el usuario dejo los recortes:
 * `luzbelito-vela.png` y `cordero-rulo.png` ya estaban pedidas por nombre en
 * `public/arte/README.md` y el archivo nunca habia llegado, asi que `recorte()` devolvia
 * null y la ficha salia sin calcomania. `momo-sampler` esperaba `banda-superheroes.png`
 * —el grupo de figuras de la tapa de *Ultimo bondi*— y se queda con el medallon de su
 * propia tapa, que es lo que llego: la ficha de un disco lleva mejor un motivo de ese
 * disco que uno prestado del vecino. `banda-superheroes.png` sigue en el despiece, en la
 * lista de piezas para producir.
 *
 * Faltan tres discos —Gulp!, Oktubre y ¡Bang! ¡Bang!— y no estan por descuido: no hay
 * pieza elegida. Para Oktubre, ademas, la unica calcada que hay es la figura encadenada,
 * y esa tiene prohibicion escrita de atribucion de album (`INV-02`, README).
 *
 * **Las dos que esperaban el recorte llegaron el 2026-10-01** (`D-51`), cortadas por el
 * hilo principal desde los masters de `Docs/INVESTIGACION/TapasDiscos/` con el mismo borde
 * de tijera que las otras: el muñeco del antifaz, tal como lo pedía el despiece, y para *La
 * mosca y la sopa* **el rótulo de la tapa con la mosca adentro**, no el gato momificado. El
 * gato no está en ninguna de las imágenes del disco que hay en el repo (frente, frente
 * real, interior y contratapa): recortarlo era inventarlo. Si alguien trae la imagen,
 * `gato-momificado.png` sigue en el despiece y se cambia acá.
 */
export const STICKER_DISCO: Record<string, string> = {
  'un-baion-para-el-ojo-idiota': 'muneco-antifaz.png',
  'la-mosca-y-la-sopa': 'mosca-rotulo.png',
  luzbelito: 'luzbelito-vela.png',
  'ultimo-bondi-a-finisterre': 'bondi-interplanetario.png',
  'momo-sampler': 'momo-medallon.png',
  'lobo-suelto': 'lobo-recortado.png',
  'cordero-atado': 'cordero-rulo.png',
};
