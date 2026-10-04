/**
 * La huella del taller de tarjetas de "¿Qué tipo de ricotero sos?" (`D-57` punto 10).
 *
 * Las cuatro tarjetas, las cuatro vistas previas y las piezas del libro son **archivos fijos
 * en el repo**: hay solo cuatro identidades y ninguna lleva un dato de la persona, así que se
 * dibujan una vez, en Node, con las letras reales del sitio. El riesgo de un archivo fijo es
 * que quede viejo: alguien cambia una bajada en el banco y la tarjeta sigue diciendo la de
 * antes, sin error y sin aviso.
 *
 * Esto lo cierra: el taller guarda en su manifiesto la huella de **todo lo que entra** —los
 * textos, los colores de `tokens.css`, las cajas de recorte, el máster, las fuentes y la
 * versión del dibujo— y `tarjetas.test.ts` la vuelve a calcular. Si no coinciden, el test dice
 * qué comando correr. Es el mismo mecanismo que ya usan las pasadas de la imprenta.
 *
 * **Solo lo importan el taller y su test.** Usa `node:fs` y `node:crypto`: ninguna isla puede
 * llegar acá (`islas.test.ts` lo vigila).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { MASTER, PIEZAS, PROHIBIDO } from './arte.ts';
import { EJES, POLOS, RESULTADO, TARJETA, PANTALLA_0 } from './copy.ts';

/**
 * La versión del dibujo. **Se sube a mano** cuando cambia la composición (un margen, un
 * cuerpo, dónde va el libro): eso no está en ningún dato, y sin este número el test no se
 * enteraría. La 2 es la de `UX-36` §6: las cuatro hojas del mismo alto, la línea que nombra
 * en dos renglones, la marca de la vista previa en la franja oscura y la sans medida.
 */
export const VERSION_DEL_DIBUJO = 2;

export const MANIFIESTO = 'scripts/dos-ejes-manifiesto.json';
export const FUENTE_CALCO = 'public/fuentes/oktubre-calco.woff';
export const FUENTE_ROTULADA = 'scripts/fuentes/archivo-black.ttf';
/** La sans del texto largo, recortada al latín (`scripts/fuentes/LICENCIA-DEJAVU.txt`). */
export const FUENTE_SANS = 'scripts/fuentes/dejavu-sans.ttf';
export const FUENTE_SANS_NEGRITA = 'scripts/fuentes/dejavu-sans-bold.ttf';

/** Los tokens que el taller pinta. Salen de `tokens.css` y de ningún otro lado. */
export const TOKENS_DEL_TALLER = [
  '--fondo',
  '--borde',
  '--texto',
  '--texto-tenue',
  '--marca-rojo',
  '--papel',
  '--papel-tenue',
  '--disco-luzbelito-tinta',
] as const;

/** El hex de cada token del taller, leído de `tokens.css`. Tira si alguno no es un hex. */
export function coloresDelTaller(css = readFileSync('src/styles/tokens.css', 'utf-8')): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const t of TOKENS_DEL_TALLER) {
    const m = new RegExp(`${t}\\s*:\\s*(#[0-9a-fA-F]{6})\\s*;`).exec(css);
    if (!m) throw new Error(`tokens.css no declara ${t} como hex`);
    salida[t] = m[1]!.toLowerCase();
  }
  return salida;
}

interface CuadranteCrudo {
  readonly id: string;
  readonly luzOscuridad: 'luz' | 'oscuridad';
  readonly ordenCaos: 'orden' | 'caos';
  readonly nombre: string;
  readonly bajada: string;
}

/** Los cuatro cuadrantes del banco, en el orden de sus ids. */
export function cuadrantesDelBanco(): CuadranteCrudo[] {
  const banco = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as { cuadrantes: CuadranteCrudo[] };
  return [...banco.cuadrantes].sort((a, b) => a.id.localeCompare(b.id));
}

const sha = (b: Buffer | string): string => createHash('sha256').update(b).digest('hex');

/** La huella de todo lo que entra al taller. Cambia una coma y cambia la huella. */
export function huellaDelTaller(): string {
  const entrada = {
    version: VERSION_DEL_DIBUJO,
    cuadrantes: cuadrantesDelBanco().map(({ id, luzOscuridad, ordenCaos, nombre, bajada }) => ({
      id,
      luzOscuridad,
      ordenCaos,
      nombre,
      bajada,
    })),
    textos: {
      titulo: PANTALLA_0.titulo,
      marca: RESULTADO.marca,
      meSalio: TARJETA.meSalio,
      pregunta: TARJETA.pregunta,
      credito: TARJETA.credito,
      polos: POLOS,
      ejes: EJES,
    },
    colores: coloresDelTaller(),
    piezas: PIEZAS,
    prohibido: PROHIBIDO,
    master: sha(readFileSync(MASTER)),
    fuentes: [FUENTE_CALCO, FUENTE_ROTULADA, FUENTE_SANS, FUENTE_SANS_NEGRITA].map((f) => sha(readFileSync(f))),
  };
  return sha(JSON.stringify(entrada));
}
