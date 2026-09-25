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
// nada, porque tambien la necesita una isla (la cama de cinta, `T-191`) y este archivo
// arrastra `node:fs`. Ver el comentario de cabecera de `graves.ts`.
import { SLUGS_GRAVES } from './graves.ts';

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
 * Que detalle de tapa viste cada seccion, bajo el mapa de `D-19` y el catalogo `UX-05`.
 * La clave es la `variante` que ya usan los casetes y las pantallas en la cocina.
 */
export const DETALLE_POR_VARIANTE: Record<string, string> = {
  marca: 'oktubre-bandera',
  mitologia: 'lobo-tiras',
  letras: 'mosca-olla',
  discos: 'bondi-circuito',
  historia: 'gulp-pincelada',
  /* `US-07`. **El hueco se lleno el 2026-09-02** y el comentario que estaba aca —"el
     recorte de Momo todavia no existe"— quedo viejo. Se genera con el resto, desde el
     master, en `scripts/generar-tapas.mjs`. Vale anotar que se veia: `detalleTapa`
     devolvia null, el casete de "Sacalo por la letra" era el unico de los siete sin
     tapa, y como `.casete-pie` reparte con `space-between`, con un solo hijo el sello
     "JUGÁ" se iba al borde izquierdo. Una tarjeta desalineada por un archivo que no
     estaba. */
  momo: 'momo-medallon',
  /* `US-08`. El zoom de la tapa de ¡Bang! ¡Bang! ya lo producia `generar-tapas.mjs` con
     los otros nueve (`UX-13`): es el unico de los diez recortes de detalle que ninguna
     seccion estaba usando. Va con su fila en `DISCO_DE`, unas lineas mas abajo — sin ella,
     la tapa se veria en el portal y **el credito de `D-21` la perderia en silencio**. */
  bang: 'bang-bang-estas-liquidado-zoom',
};

/** Que fondo velado viste cada pantalla "en la cocina" (`UX-05`).
 *  "Adivinar la tapa" y "Adivinar el tema" ya no estan aca: salieron de la cocina y
 *  sus paginas piden el fondo directo. */
export const FONDO_COCINA: Record<string, string> = {
  'completar-la-letra': 'mosca-olla',
};

/**
 * De que disco sale cada derivado. Existe por la condicion 1 de `D-21`: el credito a
 * Rocambole no alcanza generico, tiene que decir **que tapas se usaron en esa pantalla**.
 * Un fondo no tiene donde poner una firma al lado, asi que la pantalla la junta y la
 * pone en el pie (`UX-04`, mecanismo de credito).
 */
const DISCO_DE: Record<string, string> = {
  'oktubre-bandera': 'Oktubre',
  'oktubre-banderas': 'Oktubre',
  'oktubre-ok': 'Oktubre',
  'lobo-tiras': 'Lobo suelto',
  'mosca-olla': 'La mosca y la sopa',
  'bondi-circuito': 'Último bondi a Finisterre',
  'bondi-engranajes': 'Último bondi a Finisterre',
  'gulp-pincelada': 'Gulp!',
  'gulp-montana': 'Gulp!',
  'gulp-logo': 'Gulp!',
  /* Va junto con el derivado, no despues: un derivado que llega a pantalla sin su fila
     aca es una tapa que se ve y no se acredita, o sea la condicion 1 de `D-21`
     incumplida en silencio — `discosDe` lo descarta sin decir nada. */
  'momo-medallon': 'Momo Sampler',
  'bang-bang-estas-liquidado-zoom': '¡Bang! ¡Bang!… Estás liquidado',
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
 * El detalle de tapa que acompaña al titulo de un articulo que NO es de disco
 * (`UX-05`, 7b y 7c). Los de disco ya muestran su propia tapa entera: superponerles el
 * recorte de otro disco confundiria cual es cual.
 */
export function detalleArticulo(tipo: string, slug: string, categoria: string): string | null {
  if (tipo === 'disco' || SIN_DETALLE_POR_TONO.has(slug)) return null;
  return detalleTapa(DETALLE_POR_VARIANTE[categoria] ?? '');
}

/** Que recorte real reemplaza a cada dibujo de repuesto (ver public/arte/README.md). */
const RECORTE_REAL: Record<string, string> = {
  '/arte/mosca.svg': 'mosca.png',
  '/arte/banderas.svg': 'multitud-banderas.png',
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
 * Que disco viste cada categoria, escrito con el slug del disco.
 *
 * Es **el mismo mapa de `D-19`** que ya cumple `DETALLE_POR_VARIANTE` unas lineas mas
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

/** Como se llama cada disco cuando el credito de `D-21` lo nombra. */
export const TITULO_DE_DISCO: Record<string, string> = {
  gulp: 'Gulp!',
  oktubre: 'Oktubre',
  'un-baion-para-el-ojo-idiota': 'Un baión para el ojo idiota',
  'bang-bang-estas-liquidado': '¡Bang! ¡Bang!… Estás liquidado',
  'la-mosca-y-la-sopa': 'La mosca y la sopa',
  'lobo-suelto': 'Lobo suelto',
  'cordero-atado': 'Cordero atado',
  luzbelito: 'Luzbelito',
  'ultimo-bondi-a-finisterre': 'Último bondi a Finisterre',
  'momo-sampler': 'Momo Sampler',
};

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
  const archivo = ruta.split('/').pop();
  const slug = Object.keys(FIGURA_DE_DISCO).find((s) => FIGURA_DE_DISCO[s] === archivo);
  return slug ? (TITULO_DE_DISCO[slug] ?? null) : null;
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
 */
export const STICKER_DISCO: Record<string, string> = {
  'un-baion-para-el-ojo-idiota': 'muneco-antifaz.png',
  'la-mosca-y-la-sopa': 'gato-momificado.png',
  luzbelito: 'luzbelito-vela.png',
  'ultimo-bondi-a-finisterre': 'bondi-interplanetario.png',
  'momo-sampler': 'momo-medallon.png',
  'lobo-suelto': 'lobo-recortado.png',
  'cordero-atado': 'cordero-rulo.png',
};
