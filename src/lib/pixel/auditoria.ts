/**
 * Lo que el auditor de paleta mira de un sprite (`T-268`, ciclo 16; `UX-27 §3` y `§5.3`,
 * `CTR-15.4` y `CTR-15.7`).
 *
 * Puro: recibe bytes y texto, devuelve la lista de violaciones. Quien lee el disco y
 * decodifica el PNG es `scripts/auditar-paleta-pixel.mjs`; esto es lo que decide.
 *
 * Tres cosas, y ninguna se negocia:
 *
 * 1. **El archivo es PNG-32 y nada más**: RGBA de 8 bits, sin entrelazar, y sin un solo
 *    chunk de metadatos — ni perfil ICC, ni gamma, ni `pHYs`, ni texto (`UX-27 §3`). Son
 *    `IHDR`, `IDAT` e `IEND`.
 * 2. **Cada píxel tiene alfa 0 o 255**, y cada píxel opaco es una de las tintas `--px-*`
 *    de `tokens.css` — las de toda el área, no las de un atlas (`FIND-60`).
 * 3. **El JSON de al lado cumple `CTR-15.7`**: dice `contrato` y `contratoVersion`, su
 *    `pieza` es el nombre del PNG sin la versión (`skayboy` para `skayboy.v1.png`, y el PNG
 *    se llama así, `CTR-15.8`), declara la celda de `CTR-15.3` y el PNG es múltiplo de
 *    ella, nombra sus tintas por token (`CTR-15.4`) y todas existen en la hoja, el PNG no
 *    usa ninguna que su JSON no declare, y las animaciones caben en el PNG: ninguna fila ni
 *    ningún cuadro que el PNG no tenga, ninguna fila compartida, y un estado de más de un
 *    cuadro con su velocidad. Un personaje lleva además la caja de 10 × 20 y las cinco
 *    animaciones, ni una más. Un tile va opaco entero (`UX-27 §3`): ningún píxel con alfa 0
 *    adentro de un cuadro declarado. Las celdas que no son de ningún cuadro —las que sobran
 *    a la derecha de un estado más corto— quedan vacías, y no se miran.
 */

import { COLISION_PERSONAJE, ESTADOS_PERSONAJE, GRILLA, contar, losOtrosNoSeVerian, sinBom } from './fuente.ts';
import { NOMBRE_DE_TINTA, hexDeRgb } from './tokens.ts';

// Vive en `fuente.ts`, que es la base de la cadena; los scripts lo toman de acá.
export { contar };

/** Lo único que un sprite puede traer adentro (`UX-27 §3`). */
export const CHUNKS_PERMITIDOS = ['IHDR', 'IDAT', 'IEND'] as const;

const FIRMA = [137, 80, 78, 71, 13, 10, 26, 10];

export interface Cabecera {
  ancho: number;
  alto: number;
  profundidad: number;
  tipoColor: number;
  entrelazado: number;
  chunks: string[];
}

/** Recorre los chunks sin descomprimir nada. Tira si el archivo no es un PNG. */
export function leerCabecera(png: Uint8Array): Cabecera {
  if (png.length < 8 || FIRMA.some((b, i) => png[i] !== b)) throw new Error('no es un PNG');
  const vista = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const chunks: string[] = [];
  let ancho = 0, alto = 0, profundidad = 0, tipoColor = 0, entrelazado = 0;
  let p = 8;
  while (p + 8 <= png.length) {
    const largo = vista.getUint32(p);
    const tipo = String.fromCharCode(png[p + 4]!, png[p + 5]!, png[p + 6]!, png[p + 7]!);
    if (p + 12 + largo > png.length) throw new Error(`el chunk ${tipo} está cortado`);
    if (tipo === 'IHDR') {
      ancho = vista.getUint32(p + 8);
      alto = vista.getUint32(p + 12);
      profundidad = png[p + 16]!;
      tipoColor = png[p + 17]!;
      entrelazado = png[p + 20]!;
    }
    chunks.push(tipo);
    p += 12 + largo;
    if (tipo === 'IEND') break;
  }
  return { ancho, alto, profundidad, tipoColor, entrelazado, chunks };
}

/**
 * Deja solo los chunks permitidos. `sharp` escribe un `pHYs` (72 ppp) que nadie le pidió,
 * y la imprenta lo saca acá: cada chunk lleva su propio CRC, así que quitar uno entero no
 * toca a los otros.
 */
export function quitarChunks(png: Uint8Array, permitidos: readonly string[] = CHUNKS_PERMITIDOS): Uint8Array {
  const vista = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const partes: Uint8Array[] = [png.subarray(0, 8)];
  let p = 8;
  while (p + 8 <= png.length) {
    const largo = vista.getUint32(p);
    const tipo = String.fromCharCode(png[p + 4]!, png[p + 5]!, png[p + 6]!, png[p + 7]!);
    const fin = p + 12 + largo;
    if (permitidos.includes(tipo)) partes.push(png.subarray(p, fin));
    p = fin;
    if (tipo === 'IEND') break;
  }
  const total = partes.reduce((s, x) => s + x.length, 0);
  const salida = new Uint8Array(total);
  let o = 0;
  for (const x of partes) {
    salida.set(x, o);
    o += x.length;
  }
  return salida;
}

/** Lo que tiene que cumplir el archivo antes de mirar un píxel. */
export function auditarCabecera(c: Cabecera): string[] {
  const v: string[] = [];
  if (c.profundidad !== 8 || c.tipoColor !== 6) {
    v.push(`no es RGBA de 8 bits (profundidad ${c.profundidad}, tipo de color ${c.tipoColor}): UX-27 §3 pide PNG-32`);
  }
  if (c.entrelazado !== 0) v.push('está entrelazado');
  const extra = c.chunks.filter((t) => !(CHUNKS_PERMITIDOS as readonly string[]).includes(t));
  if (extra.length) {
    v.push(`trae chunks de más (${[...new Set(extra)].join(', ')}): sin perfil de color ni metadatos, UX-27 §3`);
  }
  return v;
}

/** Cuántas violaciones de cada clase se listan por archivo antes de resumir. */
export const TOPE_DE_REPORTE = 12;

/**
 * Píxel por píxel. `permitidos` son los hex de las `--px-*` resueltas. Devuelve las
 * violaciones con coordenada (x, y en píxeles nativos, desde arriba a la izquierda) y color,
 * y los colores opacos que aparecieron, para que el JSON se pueda cruzar después.
 */
export function auditarPixeles(
  rgba: Uint8Array,
  ancho: number,
  alto: number,
  permitidos: ReadonlySet<string>,
): { violaciones: string[]; usados: Map<string, [number, number]> } {
  const violaciones: string[] = [];
  const usados = new Map<string, [number, number]>();
  let alfas = 0, fuera = 0;
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const p = (y * ancho + x) * 4;
      const a = rgba[p + 3]!;
      if (a === 0) continue;
      const hex = hexDeRgb(rgba[p]!, rgba[p + 1]!, rgba[p + 2]!);
      if (a !== 255) {
        if (alfas++ < TOPE_DE_REPORTE) {
          violaciones.push(`(${x}, ${y}): alfa ${a} en ${hex} — el alfa es 0 o 255, nada en el medio (UX-27 §3)`);
        }
        continue;
      }
      if (!usados.has(hex)) usados.set(hex, [x, y]);
      if (!permitidos.has(hex)) {
        if (fuera++ < TOPE_DE_REPORTE) {
          violaciones.push(`(${x}, ${y}): ${hex} no es ninguna de las tintas --px-* de tokens.css`);
        }
      }
    }
  }
  if (alfas > TOPE_DE_REPORTE) violaciones.push(`y ${contar(alfas - TOPE_DE_REPORTE, 'píxel', 'píxeles')} más con alfa intermedio`);
  if (fuera > TOPE_DE_REPORTE) violaciones.push(`y ${contar(fuera - TOPE_DE_REPORTE, 'píxel', 'píxeles')} más fuera de la paleta`);
  return { violaciones, usados };
}

/** Lo que el auditor sabe del PNG al mirar su JSON. */
export interface PngAuditado {
  ancho: number;
  alto: number;
  /** El nombre del archivo (`skayboy.v1.png`), para cruzarlo con `pieza`. */
  archivo?: string;
  /** Los píxeles decodificados, RGBA de 8 bits, para mirar los huecos de un tile. */
  rgba?: Uint8Array;
}

/** `CTR-15.8`: `<pieza>.v<N>.png`, con la versión en el nombre. */
const NOMBRE_DE_SPRITE = /^(.+)\.v([1-9][0-9]*)\.png$/i;

/**
 * El JSON de al lado (`CTR-15.7`). `tintas` es el mapa `--px-*` → hex de la hoja; `usados`,
 * los colores opacos que el PNG trae de verdad, con el primer lugar donde aparecen.
 */
export function auditarJson(
  texto: string | null,
  tintas: ReadonlyMap<string, string>,
  png: PngAuditado,
  usados: ReadonlyMap<string, [number, number]>,
): string[] {
  const v: string[] = [];
  // El nombre del archivo es del PNG, no del JSON: se mira aunque el JSON falte.
  let piezaDelNombre: string | null = null;
  if (png.archivo !== undefined) {
    const m = png.archivo.match(NOMBRE_DE_SPRITE);
    if (m) piezaDelNombre = m[1]!;
    else v.push(`el archivo se llama ${png.archivo} y va <pieza>.v<N>.png, con N desde 1 (CTR-15.8: la versión va en el nombre)`);
  }
  if (texto === null) return [...v, 'no tiene su JSON al lado (CTR-15.7)'];
  let j: unknown;
  try {
    // Un JSON guardado a mano con BOM (el Bloc de notas lo pone) se lee igual.
    j = JSON.parse(sinBom(texto));
  } catch (e) {
    return [...v, `el JSON no se puede leer: ${(e as Error).message}`];
  }
  if (!j || typeof j !== 'object' || Array.isArray(j)) return [...v, 'el JSON no es un objeto'];
  const o = j as Record<string, unknown>;
  if (o.contrato !== 'CTR-15') v.push(`el JSON dice contrato ${JSON.stringify(o.contrato)} y va "CTR-15"`);
  if (!('contratoVersion' in o)) v.push('el JSON no dice contratoVersion: va 1 (CTR-15.7)');
  else if (o.contratoVersion !== 1) v.push(`el JSON dice contratoVersion ${JSON.stringify(o.contratoVersion)} y va el número 1 (CTR-15.7)`);
  if (!('pieza' in o)) {
    v.push('el JSON no dice pieza: va el nombre del atlas, el del PNG sin la versión (CTR-15.7)');
  } else if (typeof o.pieza !== 'string' || o.pieza === '') {
    v.push(`el JSON dice pieza ${JSON.stringify(o.pieza)} y va el nombre del atlas, como texto (CTR-15.7)`);
  } else if (piezaDelNombre !== null && o.pieza !== piezaDelNombre) {
    v.push(`el JSON dice pieza "${o.pieza}" y el archivo es de ${piezaDelNombre} (${png.archivo}): van iguales (CTR-15.7)`);
  }

  // La celda, y de ella qué pieza es: CTR-15.3 tiene dos grillas y ninguna más.
  const celda = o.celda as { ancho?: unknown; alto?: unknown } | undefined;
  let grilla: { ancho: number; alto: number } | null = null;
  let esPersonaje = false;
  let esTile = false;
  if (!celda || typeof celda.ancho !== 'number' || typeof celda.alto !== 'number' || celda.ancho <= 0 || celda.alto <= 0) {
    v.push('el JSON no declara la celda en píxeles nativos');
  } else {
    const c = { ancho: celda.ancho, alto: celda.alto };
    grilla = c;
    const igual = (g: { ancho: number; alto: number }) => g.ancho === c.ancho && g.alto === c.alto;
    esPersonaje = igual(GRILLA.personaje);
    esTile = igual(GRILLA.tile);
    if (!esPersonaje && !esTile) {
      v.push(
        `la celda de ${c.ancho} × ${c.alto} no es ninguna de CTR-15.3: ` +
          `${GRILLA.tile.ancho} × ${GRILLA.tile.alto} el tile, ${GRILLA.personaje.ancho} × ${GRILLA.personaje.alto} el personaje`,
      );
    }
    if (png.ancho % c.ancho !== 0 || png.alto % c.alto !== 0) {
      v.push(`el PNG mide ${png.ancho} × ${png.alto} y no es múltiplo de la celda de ${c.ancho} × ${c.alto}`);
    }
  }

  // La caja: la misma para los dos personajes, porque es paridad mecánica (CTR-15.3).
  if (esPersonaje) {
    const col = o.colision as { ancho?: unknown; alto?: unknown } | undefined;
    const { ancho, alto } = COLISION_PERSONAJE;
    if (!col || typeof col !== 'object') {
      v.push(`el JSON de un personaje no declara la caja de colisión: va { "ancho": ${ancho}, "alto": ${alto} } (CTR-15.3, CTR-15.7)`);
    } else if (col.ancho !== ancho || col.alto !== alto) {
      v.push(
        `la caja de colisión dice ${JSON.stringify(col.ancho)} × ${JSON.stringify(col.alto)} y va ${ancho} × ${alto}, ` +
          'igual para los dos personajes (CTR-15.3: paridad mecánica)',
      );
    }
  }

  const { violaciones, cuadros } = auditarAnimaciones(o.animaciones, grilla, png, esPersonaje);
  v.push(...violaciones);
  if (esTile && grilla && png.rgba) v.push(...auditarHuecos(png.rgba, png.ancho, grilla, cuadros));

  if (!Array.isArray(o.paleta)) {
    v.push('el JSON no declara la paleta: una lista de nombres --px-* (CTR-15.4)');
    return v;
  }
  const declarados = new Set<string>();
  for (const nombre of o.paleta) {
    if (typeof nombre !== 'string' || !NOMBRE_DE_TINTA.test(nombre)) {
      v.push(`la paleta del JSON nombra ${JSON.stringify(nombre)}: van nombres --px-*, nunca un hex (CTR-15.4)`);
      continue;
    }
    const hex = tintas.get(nombre);
    if (!hex) v.push(`la paleta del JSON nombra ${nombre}, que no existe en tokens.css`);
    else declarados.add(hex);
  }
  for (const [hex, [x, y]] of usados) {
    const nombres = [...tintas].filter(([, h]) => h === hex).map(([n]) => n);
    if (nombres.length && !declarados.has(hex)) {
      v.push(`(${x}, ${y}): usa ${nombres.join(' / ')} (${hex}) y su JSON no la declara en la paleta`);
    }
  }
  return v;
}

const esEntero = (x: unknown, desde: number): x is number => typeof x === 'number' && Number.isInteger(x) && x >= desde;

/** Un cuadro que el JSON declara y que el PNG tiene: animación, fila y columna. */
interface CuadroDeclarado {
  animacion: string;
  fila: number;
  indice: number;
}

/**
 * Las animaciones de `CTR-15.7` contra el PNG que las lleva. `grilla` es la celda ya
 * validada, o `null` si el JSON no la trae (entonces no se puede medir el PNG en filas).
 * Devuelve además los cuadros declarados que caen adentro del PNG, para mirar sus píxeles.
 */
function auditarAnimaciones(
  animaciones: unknown,
  grilla: { ancho: number; alto: number } | null,
  png: { ancho: number; alto: number },
  esPersonaje: boolean,
): { violaciones: string[]; cuadros: CuadroDeclarado[] } {
  const declarados: CuadroDeclarado[] = [];
  if (!animaciones || typeof animaciones !== 'object' || Array.isArray(animaciones) || Object.keys(animaciones).length === 0) {
    return {
      violaciones: ['el JSON no declara las animaciones: una por fila del atlas, con fila, cuadros, porSegundo y repite (CTR-15.7)'],
      cuadros: declarados,
    };
  }
  const v: string[] = [];
  const filas = grilla ? Math.floor(png.alto / grilla.alto) : null;
  const columnas = grilla ? Math.floor(png.ancho / grilla.ancho) : null;
  const duenoDeFila = new Map<number, string>();
  for (const [nombre, crudo] of Object.entries(animaciones as Record<string, unknown>)) {
    if (!crudo || typeof crudo !== 'object') {
      v.push(`la animación ${nombre} no es un objeto con fila, cuadros, porSegundo y repite (CTR-15.7)`);
      continue;
    }
    const a = crudo as Record<string, unknown>;
    const mal: string[] = [];
    if (!esEntero(a.fila, 0)) mal.push('fila (entero desde 0)');
    if (!esEntero(a.cuadros, 1)) mal.push('cuadros (entero desde 1)');
    if (typeof a.porSegundo !== 'number' || !(a.porSegundo >= 0)) mal.push('porSegundo (número desde 0; 0 es cuadro fijo, y no se omite)');
    if (typeof a.repite !== 'boolean') mal.push('repite (true o false)');
    if (mal.length) {
      v.push(`la animación ${nombre} no trae bien: ${mal.join(', ')} (CTR-15.7)`);
      continue;
    }
    const fila = a.fila as number;
    const cuadros = a.cuadros as number;
    if (filas !== null && fila >= filas) {
      v.push(`la animación ${nombre} va en la fila ${fila} y el PNG tiene ${contar(filas, 'fila', 'filas')} (CTR-15.7: una por estado, desde 0)`);
    }
    if (columnas !== null && cuadros > columnas) {
      v.push(`la animación ${nombre} declara ${cuadros} cuadros y el PNG tiene lugar para ${columnas}`);
    }
    const otra = duenoDeFila.get(fila);
    if (otra !== undefined) v.push(`las animaciones ${otra} y ${nombre} usan la misma fila ${fila}`);
    else duenoDeFila.set(fila, nombre);
    if (cuadros > 1 && a.porSegundo === 0) {
      v.push(
        `la animación ${nombre} tiene ${cuadros} cuadros y porSegundo 0: 0 es cuadro fijo (CTR-15.7) y ${losOtrosNoSeVerian(cuadros)}`,
      );
    }
    // Una fila compartida ya es violación: sus píxeles se miran una vez, con la primera.
    if (otra === undefined && filas !== null && columnas !== null && fila < filas) {
      for (let k = 0; k < Math.min(cuadros, columnas); k++) declarados.push({ animacion: nombre, fila, indice: k });
    }
  }
  if (esPersonaje) {
    const nombres = Object.keys(animaciones);
    const faltan = ESTADOS_PERSONAJE.filter((e) => !nombres.includes(e));
    const sobran = nombres.filter((e) => !(ESTADOS_PERSONAJE as readonly string[]).includes(e));
    if (faltan.length) v.push(`a un personaje le faltan animaciones de CTR-15.7: ${faltan.join(', ')}`);
    if (sobran.length) v.push(`CTR-15.7 no tiene estas animaciones, y no hay sexta: ${sobran.join(', ')}`);
  }
  return { violaciones: v, cuadros: declarados };
}

/**
 * Los tiles van opacos enteros (`UX-27 §3`: el alfa es de los sprites, no del terreno).
 * Mira solo los cuadros que el JSON declara: la celda que sobra a la derecha de un estado
 * más corto no es de nadie, y la imprenta la deja vacía a propósito. Un error por cuadro,
 * con la cuenta y el primer píxel; el alfa intermedio ya lo marcó `auditarPixeles`.
 */
function auditarHuecos(
  rgba: Uint8Array,
  ancho: number,
  celda: { ancho: number; alto: number },
  cuadros: readonly CuadroDeclarado[],
): string[] {
  const v: string[] = [];
  let conHuecos = 0;
  for (const c of cuadros) {
    let total = 0;
    let primero: [number, number] | null = null;
    for (let y = c.fila * celda.alto; y < (c.fila + 1) * celda.alto; y++) {
      for (let x = c.indice * celda.ancho; x < (c.indice + 1) * celda.ancho; x++) {
        if (rgba[(y * ancho + x) * 4 + 3] !== 0) continue;
        total++;
        primero ??= [x, y];
      }
    }
    if (total === 0 || conHuecos++ >= TOPE_DE_REPORTE) continue;
    v.push(
      `la animación ${c.animacion}, cuadro ${c.indice}, tiene ${contar(total, 'píxel transparente', 'píxeles transparentes')} ` +
        `(el primero en (${primero![0]}, ${primero![1]})): los tiles van opacos enteros, el alfa es de los personajes (UX-27 §3)`,
    );
  }
  if (conHuecos > TOPE_DE_REPORTE) {
    v.push(`y ${contar(conHuecos - TOPE_DE_REPORTE, 'cuadro', 'cuadros')} más con píxeles transparentes`);
  }
  return v;
}
