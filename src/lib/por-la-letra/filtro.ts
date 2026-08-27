/**
 * El filtro de versos de "Sacalo por la letra" (`US-07`). Implementa `CNT-11` bajo la
 * firma que fijó `CTR-09.5`.
 *
 * ## Qué hace, en una línea
 *
 * Decide qué líneas del cancionero pueden mostrarse como versos del juego, y qué ventana
 * de ocho abre la escalera de cada tema — sin juicio humano: cada regla es una cláusula
 * corrible con su motivo, y lo que no pasa se aparta **con el motivo escrito** (mismo
 * criterio que `ingerir-cancionero.mjs`).
 *
 * ## Por qué no alcanza con `sirveComoVerso()`
 *
 * Esa función se afinó para `US-03`, donde marcar de más borra un verso real de un hueco.
 * Acá el riesgo es el inverso: una línea de ruido que pase el filtro es **el enunciado
 * entero del paso 1**. `CNT-11` sección 1 encontró cuatro patrones reales que se cuelan
 * —rótulo de tramo con nombre libre, secuencia de acordes en notación latina, línea de
 * crédito del sitio, nota del transcriptor— y este archivo los cierra como reglas (a)-(d),
 * más el deduplicado (e). `CTR-09` documenta además el caso medido `[A  G]`, que cae por
 * la regla del schema y por (b).
 */

import { sirveComoVerso } from '../cancionero/anotacion.ts';
import { normalizarDuro } from '../texto.ts';

/**
 * La versión de la regla con la que se generó el banco. `CTR-09.5`: el envoltorio del
 * JSON declara este número, y el test lo compara — un banco generado con la regla vieja
 * no se puede hacer pasar por filtrado. Cuando `contenido` endurezca `CNT-11`, esto sube.
 */
export const VERSION_FILTRO = 1;

export interface VersoDelTema {
  readonly texto: string;
  /** El `tipo` de la sección del cancionero: 'estribillo', 'verso', 'desconocida'… */
  readonly seccion: string;
}

// ------------------------------------------------------------- reglas (a)-(d), CNT-11.1

/** (a) Rótulo de tramo con nombre libre: `"TEMA (E7):"`. Mayúsculas + paréntesis de acorde. */
const ROTULO_LIBRE = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{0,20}\s*\([A-G](#|b)?m?\d*\)\s*:?\s*$/;

/** (b) Nombre de acorde, latino o anglosajón: `RE`, `REsus`, `LAm`, `C#m7`, `Bb`. */
const ACORDE = /^(do|re|mi|fa|sol|la|si|[a-g])(#|b)?(m|sus\d?|dim|aum|add\d?|maj\d?|\d)*$/i;

/** (b) El paréntesis de repetición que se tolera al final: `(3 VECES)`, `(x2)`. */
const REPETICION = /\(\s*(x\s*\d+|\d+\s*veces)\s*\)\s*$/i;

/** (c) Marcas de que la línea es el encabezado o el crédito de la página de origen. */
const CREDITOS = ['patricio rey', 'redonditos de ricota', 'tabbed by'];

function esSecuenciaDeAcordes(texto: string): boolean {
  const sinRepeticion = texto.replace(REPETICION, '').trim();
  const palabras = sinRepeticion.split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return false;
  return palabras.every((p) => ACORDE.test(p));
}

function esCredito(texto: string): boolean {
  const plano = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  return CREDITOS.some((c) => plano.includes(c)) || /\(tab\)\s*$/.test(plano);
}

/**
 * Si una línea de letra puede mostrarse como verso de este juego.
 *
 * Piso: `sirveComoVerso()`. Encima, las cuatro reglas de `CNT-11` sección 1. Devuelve el
 * motivo del descarte o `null` si sirve — igual que `ventanaValida`, y por la misma razón:
 * un descarte silencioso no se puede auditar.
 */
export function motivoDescarteVerso(texto: string): string | null {
  const t = texto.trim();
  if (!sirveComoVerso(t)) return 'no pasa sirveComoVerso';
  if (ROTULO_LIBRE.test(t)) return 'rotulo de tramo con nombre libre (CNT-11 a)';
  if (esSecuenciaDeAcordes(t)) return 'secuencia de acordes sueltos (CNT-11 b)';
  if (esCredito(t)) return 'linea de credito de la fuente (CNT-11 c)';
  if (/^nota:/i.test(t)) return 'nota del transcriptor (CNT-11 d)';
  return null;
}

/**
 * La lista de versos utilizables de un tema, en orden, ya deduplicada.
 *
 * (e) de `CNT-11.1`: un estribillo repetido idéntico cuenta una sola vez — la segunda
 * aparición no suma información para adivinar el tema y infla la escalera con la misma
 * línea. La igualdad es sobre la forma dura: dos versos que difieren solo en una coma
 * son el mismo.
 */
export function versosUtilizables(lineas: readonly VersoDelTema[]): VersoDelTema[] {
  const vistos = new Set<string>();
  const salida: VersoDelTema[] = [];
  for (const v of lineas) {
    if (motivoDescarteVerso(v.texto) !== null) continue;
    const llave = normalizarDuro(v.texto);
    if (llave.length === 0 || vistos.has(llave)) continue;
    vistos.add(llave);
    salida.push({ ...v, texto: v.texto.trim() });
  }
  return salida;
}

// ------------------------------------------------------------- la regla del titulo

/**
 * `US-07` criterio 2, con la comparación que fijó `CTR-09.5`: sobre la forma **dura**
 * (sin tildes, sin puntuación, sin espacios), porque la fuente parte y pega palabras
 * donde el tracklist no lo hace. Puede pegar de más cruzando el borde entre dos palabras
 * y se acepta a propósito: **el filtro peca de descartar**, y hay 41 temas de margen.
 */
export function versoDelataTitulo(verso: string, titulo: string): boolean {
  const t = normalizarDuro(titulo);
  if (t.length === 0) return false;
  return normalizarDuro(verso).includes(t);
}

// ------------------------------------------------------------- la ventana de ocho

/** Muletillas de la puerta C. Lista cerrada de `CNT-11.3` — la amplía `contenido`, no acá. */
const MULETILLAS = new Set(['uh', 'ah', 'oh', 'eh', 'ay', 'la', 'na', 'ja', 'jo', 'che', 'ey', 'uy']);

function esInterjectivo(texto: string): boolean {
  const palabras = normalizarDuro(texto).length === 0 ? [] : texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (palabras.length === 0) return true;
  if (palabras.length < 4) return true;
  return palabras.every((p) => MULETILLAS.has(p));
}

export interface Ventana {
  /** Índice del primer verso dentro de la lista de utilizables, base 0 (`CTR-09.2`). */
  readonly desde: number;
  readonly versos: readonly VersoDelTema[];
}

/**
 * Elige la ventana de 8 versos que abre la escalera de un tema. `CNT-11` secciones 3 y 4.
 *
 * Tres puertas en cascada para el verso de apertura —nunca el primero del tema, nunca un
 * estribillo, nunca corto o interjectivo— relajadas en orden C → B → A si no alcanza.
 * De los que cumplen, **el de menor posición**: correrse lo mínimo necesario desde el
 * arranque, no saltar a la mitad de la canción.
 *
 * Devuelve `null` si el tema no tiene 8 versos utilizables sin el título — y entonces el
 * tema entero queda afuera del banco (`CNT-11.2`: no hay escalera de "menos pasos").
 */
export function elegirVentana(
  utilizables: readonly VersoDelTema[],
  titulo: string,
): Ventana | null {
  // Primero la regla del título: se descartan los versos que lo delatan, y la lista que
  // queda es sobre la que se corta la ventana (CNT-11.4: los huecos de la limpieza no
  // son un salto de fragmento).
  const sinTitulo = utilizables.filter((v) => !versoDelataTitulo(v.texto, titulo));
  if (sinTitulo.length < 8) return null;

  const ultimoArranque = sinTitulo.length - 8;
  const puertaA = (i: number) => i > 0;
  const puertaB = (i: number) => sinTitulo[i]!.seccion !== 'estribillo';
  const puertaC = (i: number) => !esInterjectivo(sinTitulo[i]!.texto);

  const cascada: Array<(i: number) => boolean> = [
    (i) => puertaA(i) && puertaB(i) && puertaC(i),
    (i) => puertaA(i) && puertaB(i),
    (i) => puertaA(i),
    () => true,
  ];
  for (const cumple of cascada) {
    for (let i = 0; i <= ultimoArranque; i++) {
      if (cumple(i)) return { desde: i, versos: sinTitulo.slice(i, i + 8) };
    }
  }
  return null; // inalcanzable: la última etapa de la cascada acepta cualquier arranque
}

/**
 * La verificación final de una ventana ya cortada, con la firma de `CTR-09.5`.
 *
 * Es la red sobre el propio generador: aunque `elegirVentana` construya bien, esta
 * función re-chequea la ventana entera contra las reglas — ocho versos, ninguno delata
 * el título, ninguno es ruido. `null` = sirve; un string = el motivo, para el log.
 */
export function ventanaValida(
  ventana: readonly VersoDelTema[],
  tema: { readonly slug: string; readonly titulo: string },
): string | null {
  if (ventana.length !== 8) return `la ventana tiene ${ventana.length} versos y BR-20 pide 8`;
  for (const v of ventana) {
    const motivo = motivoDescarteVerso(v.texto);
    if (motivo !== null) return `"${v.texto.slice(0, 40)}": ${motivo}`;
    if (versoDelataTitulo(v.texto, tema.titulo)) {
      return `"${v.texto.slice(0, 40)}": delata el titulo de ${tema.slug} (US-07 criterio 2)`;
    }
  }
  return null;
}
