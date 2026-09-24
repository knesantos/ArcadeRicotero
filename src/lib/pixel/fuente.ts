/**
 * El dibujo como texto, y el atlas que sale de él (`T-268`, ciclo 16; `D-44`).
 *
 * `D-44` decidió que el pixel lo dibuja el hilo principal **como código**: cada cuadro es
 * una grilla de texto donde cada caracter nombra una tinta `--px-*`. Este módulo lee ese
 * texto, lo valida contra `CTR-15.3` (el tamaño de la grilla) y `CTR-15.7` (los estados), y
 * compone el atlas en memoria: una fila por estado, una columna por cuadro, alfa binario.
 *
 * Es puro —sin `node:fs`, sin `sharp`—. La imprenta (`scripts/imprimir-pixel.mjs`) lo usa
 * para escribir el PNG, y un test puede usarlo para comparar dos atlas sin imprimir nada
 * (`D-44` consecuencia 3: la paridad de `BR-23.2` se cuenta comparando, no mirando).
 *
 * ## El formato, en `src/arte/pixel/<atlas>.txt`
 *
 * El nombre del archivo es el nombre del atlas: `skayboy.txt` imprime `skayboy.v<N>.png`.
 * Una directiva por renglón; los renglones en blanco separan. `#` abre un comentario hasta
 * el final del renglón: al principio de un renglón, o después de un espacio al final de
 * una directiva o de una fila de la grilla. Adentro de una grilla, el que abre el renglón
 * lleva un espacio después (`# así`): ver `cuadro`, abajo.
 *
 * Este ejemplo se copia, se pega en `src/arte/pixel/pared.txt` y se imprime tal cual: lo
 * lee un test (`imprenta.test.ts`), así que no puede quedar desactualizado sin que se note.
 *
 * ```
 * # Un tile de la sala: una pared de ladrillo.
 * tipo: tile            # tile = 16 × 16 · personaje = 16 × 24 (CTR-15.3)
 * version: 1            # el número que va en el nombre del archivo (CTR-15.8)
 *
 * tinta: K --px-clave   # un caracter, una tinta; el '.' es transparente, solo de personajes
 * tinta: L --px-luz
 *
 * estado: pared  cuadros=1    # una fila del atlas por estado, en el orden en que se declaran
 * # uno animado se declara así:  estado: corre  cuadros=4  porSegundo=10  repite=si
 *
 * cuadro: pared 0       # y abajo, exactamente 16 renglones de 16 caracteres
 * KKKKKKKKKKKKKKKK
 * LLLLLLLKLLLLLLLK
 * LLLLLLLKLLLLLLLK
 * LLLLLLLKLLLLLLLK
 * KKKKKKKKKKKKKKKK
 * LLLKLLLLLLLKLLLL
 * LLLKLLLLLLLKLLLL
 * LLLKLLLLLLLKLLLL
 * KKKKKKKKKKKKKKKK
 * LLLLLLLKLLLLLLLK
 * LLLLLLLKLLLLLLLK
 * LLLLLLLKLLLLLLLK
 * KKKKKKKKKKKKKKKK
 * LLLKLLLLLLLKLLLL
 * LLLKLLLLLLLKLLLL
 * LLLKLLLLLLLKLLLL
 * ```
 *
 * - **`tipo`** decide la grilla, y la grilla no se declara: sale de `CTR-15.3`. Un
 *   personaje lleva 24 renglones por cuadro y además los cinco estados de `CTR-15.7`
 *   (`quieto`, `corre`, `salta`, `cae`, `enPausa`), ni uno más ni uno menos. **Los tiles
 *   van opacos enteros** (`UX-27 §3`): un `.` en la grilla de un tile es error, porque el
 *   `.` es de los personajes. El auditor mira lo mismo en el PNG.
 * - **`tinta`**: un caracter visible cualquiera menos `.` (transparente), `#` (comentario)
 *   y `:` (directiva), y un nombre `--px-*`. Dos caracteres no pueden nombrar la misma
 *   tinta. El nombre se resuelve contra `tokens.css` al imprimir, nunca acá.
 * - **`estado`**: `cuadros` es obligatorio; `repite` vale `no` si no se dice (`si` y `sí`
 *   valen igual). `porSegundo` vale 0 si no se dice, y 0 es cuadro fijo (`CTR-15.7`): **un
 *   estado de más de un cuadro tiene que decir su velocidad**, o sus otros cuadros no se
 *   verían nunca. Si son variantes que elige el juego (una palanca arriba y abajo), cada una
 *   es su propio estado.
 * - **`cuadro: <estado> <índice>`**: los índices van de 0 a `cuadros - 1`, cada uno una vez.
 *   La grilla termina en el primer renglón en blanco. Un comentario adentro no cuenta si el
 *   `#` abre el renglón con un espacio después (`# así`) o va al final con un espacio
 *   antes. Pegado a la grilla —`#KKKK` o `KKKK#`— no es comentario: es un caracter, no está
 *   en ninguna leyenda, y da error en vez de comerse la fila.
 * - El archivo puede venir con BOM (el Bloc de notas lo pone) y con fin de renglón de
 *   Windows: se lee igual.
 *
 * Todo error nombra el archivo y el renglón (`skayboy.txt:31`), y se juntan todos antes de
 * contestar: arreglar un dibujo de a un error por corrida es un castigo. Un caracter que no
 * está en la leyenda da **un** error con la cuenta y las primeras posiciones, no uno por
 * celda: si una tinta se declaró mal, el error de la tinta es el que hay que ver. Lo mismo
 * con un estado que no pudo declarar sus cuadros: sus cuadros dan un error juntos, que
 * manda a arreglar el renglón del estado.
 */

import { NOMBRE_DE_TINTA, rgbDeHex } from './tokens.ts';

export type TipoDeAtlas = 'personaje' | 'tile';

/** `CTR-15.3`, en píxeles nativos. */
export const GRILLA: Readonly<Record<TipoDeAtlas, { ancho: number; alto: number }>> = {
  personaje: { ancho: 16, alto: 24 },
  tile: { ancho: 16, alto: 16 },
};

/** `CTR-15.3`: igual para los dos personajes, porque es paridad mecánica y no estética. */
export const COLISION_PERSONAJE = { ancho: 10, alto: 20 } as const;

/** `CTR-15.7`: las cinco son obligatorias, y no hay sexta. */
export const ESTADOS_PERSONAJE = ['quieto', 'corre', 'salta', 'cae', 'enPausa'] as const;

export const TRANSPARENTE = '.';

export interface Estado {
  nombre: string;
  cuadros: number;
  porSegundo: number;
  repite: boolean;
  renglon: number;
}

export interface Cuadro {
  estado: string;
  indice: number;
  /** Renglón del encabezado `cuadro:` en el archivo, para los mensajes. */
  renglon: number;
  /** Las filas de la grilla, tal como están escritas. */
  filas: string[];
}

export interface Dibujo {
  atlas: string;
  archivo: string;
  tipo: TipoDeAtlas;
  version: number;
  /** Caracter → nombre `--px-*`, en el orden de la leyenda. */
  leyenda: Map<string, string>;
  estados: Estado[];
  cuadros: Cuadro[];
  /** Renglón donde se declaró cada caracter de la leyenda, para los mensajes. */
  renglonDeTinta: Map<string, number>;
}

export type Lectura = { dibujo: Dibujo; errores: [] } | { dibujo: null; errores: string[] };

/** Cuántas posiciones nombra el error de un caracter fuera de la leyenda antes de contar. */
export const POSICIONES_POR_ERROR = 5;

const NOMBRE_DE_ATLAS = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOMBRE_DE_ESTADO = /^[a-zA-Z][a-zA-Z0-9]*$/;

/** Fuera de una grilla, un renglón que empieza con `#` es comentario, lleve lo que lleve. */
const COMENTARIO = /^\s*#/;
/**
 * Adentro de una grilla, solo si al `#` le sigue un espacio o nada. `#KKKK…` es una fila con
 * un caracter que no está en la leyenda: tiene que dar error, no desaparecer sin aviso.
 */
const COMENTARIO_EN_GRILLA = /^\s*#(?:\s|$)/;

/** `3 violaciones`, `1 violación`: el plural lo decide quien llama, con las dos formas. */
export function contar(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`;
}

/** Lo que no se ve de un estado quieto de varios cuadros: `el otro`, `los otros 3`. */
export function losOtrosNoSeVerian(cuadros: number): string {
  const otros = cuadros - 1;
  return otros === 1 ? 'el otro no se vería nunca' : `los otros ${otros} no se verían nunca`;
}

/**
 * Saca el BOM que el Bloc de notas pone al principio de un UTF-8. Se compara por código y no
 * con el caracter escrito: un U+FEFF literal es invisible, y un editor lo borra sin avisar.
 */
export function sinBom(texto: string): string {
  return texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
}

/** `a, b, c y 4 más`: la lista ya recortada, y cuántos había en total. */
function enumerar(lista: readonly string[], total: number): string {
  const quedan = total - lista.length;
  return lista.join(', ') + (quedan > 0 ? ` y ${quedan} más` : '');
}

/**
 * Lee un dibujo. `archivo` es el nombre con el que se lo nombra en los errores
 * (`skayboy.txt`); el atlas se llama como el archivo sin la extensión.
 */
export function leerDibujo(texto: string, archivo: string): Lectura {
  const errores: string[] = [];
  const en = (renglon: number, msj: string) => errores.push(`${archivo}:${renglon}: ${msj}`);

  const atlas = archivo.replace(/^.*[\\/]/, '').replace(/\.txt$/, '');
  if (!NOMBRE_DE_ATLAS.test(atlas)) {
    errores.push(`${archivo}: el nombre del archivo es el del atlas y va en minúscula con guiones ("${atlas}" no sirve)`);
  }

  const renglones = sinBom(texto).replace(/\r\n?/g, '\n').split('\n');
  let tipo: TipoDeAtlas | null = null;
  let version: number | null = null;
  /** Si hubo renglón de tipo o de versión, aunque mal escrito: entonces no "falta". */
  let tipoEscrito = false;
  let versionEscrita = false;
  const leyenda = new Map<string, string>();
  const renglonDeTinta = new Map<string, number>();
  /** Caracter → renglón de una `tinta:` que lo quiso declarar y no pudo, para el mensaje. */
  const tintaFallida = new Map<string, number>();
  /** Nombre → renglón de un `estado:` que no pudo declarar sus cuadros, para el mensaje. */
  const estadoFallido = new Map<string, number>();
  const estados: Estado[] = [];
  const cuadros: Cuadro[] = [];
  let abierto: Cuadro | null = null;
  /**
   * Un `cuadro:` que no se entendió deja abajo su grilla: esas filas se saltean hasta el
   * próximo blanco, porque el error ya está en el encabezado y dieciséis más lo taparían.
   */
  let salteando = false;

  const cerrar = () => {
    if (abierto) cuadros.push(abierto);
    abierto = null;
    salteando = false;
  };

  for (let i = 0; i < renglones.length; i++) {
    const n = i + 1;
    const entero = renglones[i]!.replace(/\s+$/, '');
    if ((abierto || salteando ? COMENTARIO_EN_GRILLA : COMENTARIO).test(entero)) continue;
    if (entero === '') {
      cerrar();
      continue;
    }
    // Un "#" después de un espacio abre un comentario hasta el final del renglón.
    const crudo = entero.replace(/\s+#.*$/, '');
    const directiva = crudo.match(/^([a-z]+):\s*(.*)$/);
    if (!directiva) {
      if (abierto) {
        (abierto as Cuadro).filas.push(crudo);
        continue;
      }
      if (salteando) continue;
      en(n, `no es una directiva (tipo, version, tinta, estado, cuadro) ni está adentro de un cuadro: "${crudo}"`);
      continue;
    }
    cerrar();
    const [, clave, resto] = directiva as unknown as [string, string, string];
    switch (clave) {
      case 'tipo': {
        tipoEscrito = true;
        if (tipo !== null) en(n, 'el tipo ya estaba declarado');
        else if (resto === 'personaje' || resto === 'tile') tipo = resto;
        else en(n, `tipo "${resto}" no existe: es personaje (16 × 24) o tile (16 × 16), CTR-15.3`);
        break;
      }
      case 'version': {
        versionEscrita = true;
        if (version !== null) en(n, 'la versión ya estaba declarada');
        else if (/^[1-9][0-9]*$/.test(resto)) version = Number(resto);
        else en(n, `versión "${resto}": va un entero desde 1 (CTR-15.8)`);
        break;
      }
      case 'tinta': {
        if (/^tinta:\s*#/.test(entero)) {
          en(n, '"#" abre un comentario y no puede ser una tinta');
          break;
        }
        // Un hex después de un espacio parece un comentario, y es el error más probable de
        // todos: se mira en el renglón entero, antes de que el comentario se lo coma.
        const conHex = entero.match(/^tinta:\s*(\S)\s+(#[0-9a-fA-F]{3,8})(?:\s|$)/);
        if (conHex) {
          en(n, `"${conHex[2]}" no es un nombre de tinta --px-* (CTR-15.4: por token, nunca por hex)`);
          if (!tintaFallida.has(conHex[1]!)) tintaFallida.set(conHex[1]!, n);
          break;
        }
        const m = resto.match(/^(\S)\s+(\S+)$/);
        if (!m) {
          en(n, `la tinta se escribe "tinta: <un caracter> --px-nombre" y dice "${resto}"`);
          const intento = resto.match(/^(\S)(?:\s|$)/);
          if (intento && !tintaFallida.has(intento[1]!)) tintaFallida.set(intento[1]!, n);
          break;
        }
        const [, car, nombre] = m as unknown as [string, string, string];
        let registrada = false;
        if (car === TRANSPARENTE) en(n, `"${TRANSPARENTE}" es transparente y no se le asigna tinta`);
        else if (car === ':') en(n, '":" confunde un renglón de la grilla con una directiva y no puede ser una tinta');
        else if (!NOMBRE_DE_TINTA.test(nombre)) en(n, `"${nombre}" no es un nombre de tinta --px-* (CTR-15.4: por token, nunca por hex)`);
        else if (leyenda.has(car)) en(n, `"${car}" ya nombra ${leyenda.get(car)} (renglón ${renglonDeTinta.get(car)})`);
        else {
          const otro = [...leyenda].find(([, v]) => v === nombre);
          if (otro) en(n, `${nombre} ya tiene caracter: "${otro[0]}" (renglón ${renglonDeTinta.get(otro[0])})`);
          else {
            leyenda.set(car, nombre);
            renglonDeTinta.set(car, n);
            registrada = true;
          }
        }
        if (!registrada && !leyenda.has(car) && !tintaFallida.has(car)) tintaFallida.set(car, n);
        break;
      }
      case 'estado': {
        const partes = resto.split(/\s+/);
        const nombre = partes.shift() ?? '';
        if (!NOMBRE_DE_ESTADO.test(nombre)) {
          en(n, `nombre de estado "${nombre}" no sirve: letras y números, empezando por letra`);
          break;
        }
        if (estados.some((e) => e.nombre === nombre)) {
          en(n, `el estado ${nombre} ya estaba declarado`);
          break;
        }
        const opciones = new Map<string, string>();
        for (const p of partes) {
          const kv = p.match(/^([a-zA-Z]+)=(\S+)$/);
          if (!kv || !['cuadros', 'porSegundo', 'repite'].includes(kv[1]!)) {
            en(n, `"${p}" no se entiende: van cuadros=N, porSegundo=N y repite=si|no`);
          } else opciones.set(kv[1]!, kv[2]!);
        }
        const cu = opciones.get('cuadros');
        const ps = opciones.get('porSegundo') ?? '0';
        const re = opciones.get('repite') ?? 'no';
        const cuadrosBien = cu !== undefined && /^[1-9][0-9]*$/.test(cu);
        const velocidadBien = /^[0-9]+(\.[0-9]+)?$/.test(ps);
        if (!cuadrosBien) {
          en(n, `el estado ${nombre} necesita cuadros=N, con N entero desde 1`);
          estadoFallido.set(nombre, n);
        }
        if (!velocidadBien) en(n, `porSegundo=${ps}: va un número desde 0 (0 es cuadro fijo, CTR-15.7)`);
        // "sí" con tilde es como lo escribe cualquiera en castellano, y vale lo mismo.
        if (re !== 'si' && re !== 'sí' && re !== 'no') en(n, `repite=${re}: va si o no`);
        if (!cuadrosBien) break;
        // Con los cuadros bien, el estado se guarda aunque otra opción esté mal: ese error
        // ya quedó anotado, y sin el estado cada cuadro sumaría uno de "estado no declarado".
        estados.push({
          nombre,
          cuadros: Number(cu),
          porSegundo: velocidadBien ? Number(ps) : 0,
          repite: re === 'si' || re === 'sí',
          renglon: n,
        });
        if (velocidadBien && Number(cu) > 1 && Number(ps) === 0) {
          en(
            n,
            `el estado ${nombre} tiene ${cu} cuadros y porSegundo 0: 0 es cuadro fijo (CTR-15.7) y ${losOtrosNoSeVerian(Number(cu))}. ` +
              'Poné porSegundo=N; o, si son variantes que elige el juego, declará cada una como su propio estado',
          );
        }
        break;
      }
      case 'cuadro': {
        const m = resto.match(/^([a-zA-Z][a-zA-Z0-9]*)\s+([0-9]+)$/);
        if (!m) {
          en(n, `el cuadro se abre con "cuadro: <estado> <índice>" y dice "${resto}"`);
          salteando = true;
          break;
        }
        abierto = { estado: m[1]!, indice: Number(m[2]), renglon: n, filas: [] };
        break;
      }
      default:
        en(n, `directiva "${clave}:" no existe (van tipo, version, tinta, estado, cuadro)`);
    }
  }
  cerrar();

  if (tipo === null && !tipoEscrito) errores.push(`${archivo}: falta "tipo: personaje" o "tipo: tile"`);
  if (version === null && !versionEscrita) errores.push(`${archivo}: falta "version: N" (CTR-15.8)`);
  // Un estado que se intentó declarar y no pudo ya tiene su error: no "falta".
  if (estados.length === 0 && estadoFallido.size === 0) errores.push(`${archivo}: no declara ningún estado`);

  if (tipo === 'personaje') {
    const nombres = estados.map((e) => e.nombre);
    const faltan = ESTADOS_PERSONAJE.filter((e) => !nombres.includes(e) && !estadoFallido.has(e));
    const sobran = nombres.filter((e) => !(ESTADOS_PERSONAJE as readonly string[]).includes(e));
    if (faltan.length) errores.push(`${archivo}: a un personaje le faltan estados de CTR-15.7: ${faltan.join(', ')}`);
    if (sobran.length) errores.push(`${archivo}: CTR-15.7 no tiene estos estados, y no hay sexta: ${sobran.join(', ')}`);
  }

  // Las grillas: tamaño exacto y caracteres de la leyenda. Un caracter fuera de la leyenda
  // se junta en un solo error: una tinta mal declarada deja sin leyenda cientos de celdas,
  // y un error por celda tapa el único que importa, el de la tinta. En un tile, el "."
  // también se junta así: los tiles van opacos enteros (UX-27 §3).
  const desconocidos = new Map<string, { total: number; primerRenglon: number; posiciones: string[] }>();
  if (tipo !== null) {
    const { ancho, alto } = GRILLA[tipo];
    for (const c of cuadros) {
      const nombre = `${c.estado} ${c.indice}`;
      if (c.filas.length !== alto) {
        // Si faltan, se nombra el renglón donde la grilla se cortó; si sobran, el primero de más.
        const ultimo = c.filas.length ? renglonDeFila(renglones, c, c.filas.length - 1) : c.renglon;
        en(
          c.filas.length < alto ? ultimo + 1 : renglonDeFila(renglones, c, alto),
          c.filas.length < alto
            ? `al cuadro ${nombre} le faltan renglones: tiene ${c.filas.length} y un ${tipo} lleva ${alto} (CTR-15.3)`
            : `al cuadro ${nombre} le sobran renglones: tiene ${c.filas.length} y un ${tipo} lleva ${alto} (CTR-15.3)`,
        );
      }
      c.filas.forEach((fila, j) => {
        const n = renglonDeFila(renglones, c, j);
        const largo = [...fila].length;
        if (largo !== ancho) {
          en(n, `el renglón ${j + 1} del cuadro ${nombre} tiene ${largo} caracteres y la grilla pide ${ancho} (CTR-15.3)`);
        }
        [...fila].forEach((car, col) => {
          if (leyenda.has(car) || (car === TRANSPARENTE && tipo === 'personaje')) return;
          let g = desconocidos.get(car);
          if (!g) desconocidos.set(car, (g = { total: 0, primerRenglon: n, posiciones: [] }));
          g.total++;
          if (g.posiciones.length < POSICIONES_POR_ERROR) g.posiciones.push(`renglón ${n} columna ${col + 1} (cuadro ${nombre})`);
        });
      });
    }
  }
  for (const [car, g] of desconocidos) {
    const veces = contar(g.total, 'vez', 'veces');
    const donde = enumerar(g.posiciones, g.total);
    if (car === TRANSPARENTE) {
      en(
        g.primerRenglon,
        `"." es transparente y un tile va opaco entero (UX-27 §3); aparece ${veces}: ${donde}. ` +
          'El "." es de los personajes: en un tile, cada celda lleva una tinta',
      );
      continue;
    }
    const intento = tintaFallida.get(car);
    en(
      g.primerRenglon,
      `"${car}" no está en la leyenda y aparece ${veces}: ${donde}` +
        (intento ? `. El renglón ${intento} intentó declararlo y no pudo: arreglá ese primero` : '') +
        (car === '#'
          ? '. Si era un comentario: adentro de una grilla, el "#" lleva un espacio después si abre el renglón, y uno antes si va al final'
          : ''),
    );
  }

  // Los cuadros contra los estados: ninguno de más, ninguno repetido, ninguno faltante. Los
  // de un estado que no existe se juntan por estado, como los caracteres: si el estado se
  // declaró mal, el error que hay que ver es el del estado, no uno por cuadro.
  const sinEstado = new Map<string, Cuadro[]>();
  for (const c of cuadros) {
    const e = estados.find((x) => x.nombre === c.estado);
    if (!e) sinEstado.set(c.estado, [...(sinEstado.get(c.estado) ?? []), c]);
    else if (c.indice >= e.cuadros) {
      en(c.renglon, `el cuadro ${c.estado} ${c.indice} se pasa: el estado declara ${e.cuadros} (índices 0 a ${e.cuadros - 1})`);
    }
  }
  for (const [nombre, lista] of sinEstado) {
    const intento = estadoFallido.get(nombre);
    const donde = enumerar(lista.slice(0, POSICIONES_POR_ERROR).map((c) => String(c.renglon)), lista.length);
    en(
      lista[0]!.renglon,
      `el estado ${nombre} no se declaró y tiene ${contar(lista.length, 'cuadro dibujado', 'cuadros dibujados')} ` +
        `(${lista.length === 1 ? 'renglón' : 'renglones'} ${donde})` +
        (intento ? `. El renglón ${intento} intentó declararlo y no pudo: arreglá ese primero` : ''),
    );
  }
  const vistos = new Map<string, number>();
  for (const c of cuadros) {
    const clave = `${c.estado} ${c.indice}`;
    if (vistos.has(clave)) en(c.renglon, `el cuadro ${clave} ya estaba dibujado en el renglón ${vistos.get(clave)}`);
    else vistos.set(clave, c.renglon);
  }
  for (const e of estados) {
    for (let k = 0; k < e.cuadros; k++) {
      if (!vistos.has(`${e.nombre} ${k}`)) {
        en(e.renglon, `falta el cuadro ${e.nombre} ${k}: el estado declara ${e.cuadros}`);
      }
    }
  }

  if (errores.length > 0 || tipo === null || version === null) {
    return { dibujo: null, errores: errores.length ? errores : [`${archivo}: no se pudo leer`] };
  }
  return {
    dibujo: { atlas, archivo, tipo, version, leyenda, estados, cuadros, renglonDeTinta },
    errores: [],
  };
}

/** En qué renglón del archivo quedó la fila `j` del cuadro, salteando comentarios. */
function renglonDeFila(renglones: readonly string[], c: Cuadro, j: number): number {
  let visto = -1;
  for (let i = c.renglon; i < renglones.length; i++) {
    // La misma regla que al leer: adentro de la grilla, "#KKKK" es una fila y cuenta.
    if (COMENTARIO_EN_GRILLA.test(renglones[i]!.replace(/\s+$/, ''))) continue;
    visto++;
    if (visto === j) return i + 1;
  }
  return c.renglon + j + 1;
}

/** Las tintas que el dibujo usa de verdad, en el orden de la leyenda. */
export function tintasUsadas(d: Dibujo): string[] {
  const usados = new Set<string>();
  for (const c of d.cuadros) for (const fila of c.filas) for (const car of fila) usados.add(car);
  return [...d.leyenda].filter(([car]) => usados.has(car)).map(([, nombre]) => nombre);
}

/** El JSON de `CTR-15.7` que va al lado del PNG. */
export interface JsonDelAtlas {
  contrato: 'CTR-15';
  contratoVersion: 1;
  pieza: string;
  celda: { ancho: number; alto: number };
  colision?: { ancho: number; alto: number };
  paleta: string[];
  animaciones: Record<string, { fila: number; cuadros: number; porSegundo: number; repite: boolean }>;
}

export function jsonDelAtlas(d: Dibujo): JsonDelAtlas {
  const animaciones: JsonDelAtlas['animaciones'] = {};
  d.estados.forEach((e, fila) => {
    animaciones[e.nombre] = { fila, cuadros: e.cuadros, porSegundo: e.porSegundo, repite: e.repite };
  });
  return {
    contrato: 'CTR-15',
    contratoVersion: 1,
    pieza: d.atlas,
    celda: { ...GRILLA[d.tipo] },
    ...(d.tipo === 'personaje' ? { colision: { ...COLISION_PERSONAJE } } : {}),
    paleta: tintasUsadas(d),
    animaciones,
  };
}

/**
 * Lo que el motor da por cierto (`CTR-15.8`): si esto cambia, la versión tiene que subir.
 * Repintar una tinta no lo cambia; mover una fila, sumar un cuadro o cambiar la celda sí.
 */
export function estructura(j: Pick<JsonDelAtlas, 'celda' | 'colision' | 'animaciones'>): string {
  const anim = Object.entries(j.animaciones ?? {})
    .map(([k, v]) => `${k}:${v.fila}:${v.cuadros}`)
    .sort()
    .join(',');
  const col = j.colision ? `${j.colision.ancho}x${j.colision.alto}` : '-';
  return `celda=${j.celda?.ancho}x${j.celda?.alto} colision=${col} filas=${anim}`;
}

export interface AtlasCompuesto {
  ancho: number;
  alto: number;
  /** RGBA de 8 bits, cuatro bytes por píxel. Transparente es 0,0,0,0. */
  rgba: Uint8Array;
  json: JsonDelAtlas;
}

/**
 * Compone el atlas: fila = estado en el orden declarado, columna = cuadro. Las celdas que
 * sobran a la derecha de un estado con menos cuadros quedan transparentes. `tintas` es el
 * mapa `--px-*` → hex que sale de `tokens.css`; si un nombre de la leyenda no está, tira:
 * la imprenta lo verifica antes y nunca llega acá con un faltante.
 */
export function componerAtlas(d: Dibujo, tintas: ReadonlyMap<string, string>): AtlasCompuesto {
  const { ancho: cw, alto: ch } = GRILLA[d.tipo];
  const columnas = Math.max(...d.estados.map((e) => e.cuadros));
  const ancho = columnas * cw;
  const alto = d.estados.length * ch;
  const rgba = new Uint8Array(ancho * alto * 4);
  const rgbDe = new Map<string, [number, number, number]>();
  for (const [car, nombre] of d.leyenda) {
    const hex = tintas.get(nombre);
    if (!hex) throw new Error(`${d.archivo}: ${nombre} no está en la paleta resuelta`);
    rgbDe.set(car, rgbDeHex(hex));
  }
  const filaDe = new Map(d.estados.map((e, i) => [e.nombre, i]));
  for (const c of d.cuadros) {
    const x0 = c.indice * cw;
    const y0 = filaDe.get(c.estado)! * ch;
    c.filas.forEach((fila, y) => {
      [...fila].forEach((car, x) => {
        if (car === TRANSPARENTE) return;
        const [r, g, b] = rgbDe.get(car)!;
        const p = ((y0 + y) * ancho + (x0 + x)) * 4;
        rgba[p] = r;
        rgba[p + 1] = g;
        rgba[p + 2] = b;
        rgba[p + 3] = 255;
      });
    });
  }
  return { ancho, alto, rgba, json: jsonDelAtlas(d) };
}
