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
 *
 * **v2 (`REV-08` / `FIND-30`):** la regla de acordes exigia que TODAS las palabras lo
 * fueran, y nueve de los 93 items publicados mostraban cifra como verso escapandose por
 * una sola palabra suelta. Ahora basta con mayoria de acordes, o con sangria ancha.
 */
export const VERSION_FILTRO = 6;

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

/**
 * `REV-08` / `FIND-30`: **la regla de "todas las palabras son acordes" no alcanzaba.**
 *
 * Nueve de los 93 ítems publicados mostraban cifra como verso, y todos se escapaban por
 * lo mismo: **una sola palabra que no era acorde**. Casos reales del banco:
 *
 *   "Bm             G      A    Bm   +(riff1)"   ← se escapa por `+(riff1)`
 *   "E  amor...  G9         (C7 -C9 )    G9"     ← se escapa por `amor...`
 *   "A  (puente)"                                ← se escapa por `(puente)`
 *   "D PITE PUENTE  X2"                          ← se escapa por `PITE` y `PUENTE`
 *
 * Ahora son **dos** señales, y con una alcanza:
 *
 * 1. **Mayoría de acordes.** Al menos dos nombres de acorde y que sean la mitad o más de
 *    las palabras. Una palabra suelta ya no salva la línea.
 * 2. **Sangría ancha.** Tres o más espacios seguidos adentro del renglón es maquetado de
 *    cifra: la letra cantada no se escribe así. Es la señal más barata y la más difícil
 *    de esquivar, porque el alineado del acorde sobre la sílaba **necesita** esos espacios.
 */
function esSecuenciaDeAcordes(texto: string): boolean {
  const sinRepeticion = texto.replace(REPETICION, '').trim();
  const palabras = sinRepeticion.split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return false;
  if (palabras.every((p) => ACORDE.test(p))) return true;

  const acordes = palabras.filter((p) => ACORDE.test(p.replace(/^[+(]+|[)]+$/g, ''))).length;
  return acordes >= 2 && acordes >= palabras.length / 2;
}

/** Sangría de cifra: la letra cantada no lleva tres espacios seguidos adentro del renglón. */
const SANGRIA_ANCHA = /\S {3,}\S/;

/**
 * Palabras de estructura sueltas: `puente`, `intro`, `verso`, `estribillo`, `solo`…
 * No alcanzan solas para descartar —"el puente" puede ser un verso— pero sí cuando
 * aparecen **junto a un acorde**, que es la firma de un renglón de cifra anotado.
 */
/**
 * **Dura**: palabras que en una letra de los Redondos no aparecen nunca. Se pueden usar
 * como señal junto a un acorde sin riesgo.
 */
const ESTRUCTURA_DURA = /\b(intro|introduccion|introducion|estribillo|outro|riff|fill|tab)\d*\b/i;

/**
 * **Blanda**: palabras que marcan estructura en una cifra **pero también son letra**.
 *
 * Y acá está la trampa que casi me como un pedazo del cancionero: en castellano `Mi`,
 * `La`, `Do`, `Re`, `Fa` y `Si` son a la vez **nombres de acorde y palabras corrientes**.
 * La primera versión de esta regla —"un acorde más una palabra de estructura"— mataba
 * *"Mi bajo continuo suena mal"* y *"Toco la guitarra en el balcón"*: dos versos cantados
 * perfectamente válidos, uno por `Mi`+`bajo` y el otro por `la`+`guitarra`.
 *
 * Por eso esta lista **no se usa junto a un acorde**. Solo entra en la regla (g), donde
 * hace falta que **todas** las palabras del renglón sean no-letra — ahí es segura, porque
 * un verso cantado siempre trae al menos una palabra que no es ni acorde ni marca.
 */
const ESTRUCTURA_BLANDA =
  /\b(puente|verso|solo|coro|final|repite|repiten|guitarra|violin|bajo|bateria|saxo|teclado|piano)\d*\b/i;

const ESTRUCTURA = ESTRUCTURA_DURA;

/** Un acorde con la puntuación que le cuelga el transcriptor: `LAm.`, `(G)`, `D,`. */
function esAcorde(palabra: string): boolean {
  return ACORDE.test(palabra.replace(/^[+(]+|[).,;:]+$/g, ''));
}

/**
 * Una palabra que no aporta letra: un acorde, una palabra de estructura, o un número.
 *
 * Sirve para la regla (g): **si TODAS las palabras del renglón son de estas, no hay nada
 * cantado ahí.** Caza `"(Repite Intro)"` y `"RIff1"`, que esquivaban todo lo demás porque
 * no tienen acordes ni sangría ancha.
 */
function noAportaLetra(palabra: string): boolean {
  const limpia = palabra.replace(/^[+(¡¿]+|[).,;:!?]+$/g, '');
  if (!limpia) return true;
  if (esAcorde(limpia)) return true;
  if (/^\d+$/.test(limpia)) return true;
  // Acá sí entran las blandas: la regla (g) exige que **todas** las palabras sean de
  // estas, y un verso cantado siempre trae al menos una que no lo es.
  return (ESTRUCTURA_DURA.test(limpia) || ESTRUCTURA_BLANDA.test(limpia)) && limpia.length <= 14;
}

function esRenglonDeCifra(texto: string): boolean {
  if (SANGRIA_ANCHA.test(texto)) return true;
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return false;

  // (i) `"Parte 1 de 3"`: la fuente parte un tema largo y numera los pedazos. No lleva
  // ni dos puntos ni paréntesis ni acordes, así que esquivaba todo lo demás — lo encontró
  // `contenido` al rehacer la selección de `T-138`, y ya había hecho fallar la anterior.
  if (/^\s*parte\s+\d+\s*(de\s*\d+)?\s*$/i.test(texto)) return true;

  // (f) Un renglón que termina en dos puntos es una etiqueta, no algo que se canta.
  // Caza `"G  O DE GUITARRA:"` y `"G  O DE VIOLIN::"` — "SOLO DE GUITARRA" mal cortado
  // por la fuente, que esquivaba todo lo demás.
  if (/:+\s*$/.test(texto)) return true;

  // (g) Ninguna palabra aporta letra: todo son acordes, marcas de estructura o números.
  // Caza `"(Repite Intro)"` y `"RIff1"`, que no tienen ni acordes ni sangría ancha.
  if (palabras.every(noAportaLetra)) return true;

  // (h) Renglón entero en mayúsculas con tres o más palabras: es una instrucción del
  // transcriptor, no algo que se canta.
  //
  // **El alcance está medido, no supuesto.** Sobre los 712 versos del banco esta regla
  // marca exactamente dos, y los dos son ruido: `"D PITE PUENTE  X2"` (un "REPITE" al
  // que la fuente se le comió las dos primeras letras) y `"RIFF3 ] X4"`. Cero versos
  // cantados. Si algún día una fuente transcribe letra en mayúsculas, esta regla se los
  // come y hay que medirla de nuevo.
  const letras = texto.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '');
  if (letras.length > 2 && letras === letras.toUpperCase() && palabras.length >= 3) return true;

  return palabras.some(esAcorde) && ESTRUCTURA.test(texto);
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
  // La regla del schema de CTR-09, espejada aca: una linea que es toda un corchete es
  // del que transcribio, no un verso. Cierra el caso medido `[A  G]`, que ademas venia
  // con los corchetes pegados a los acordes y esquivaba la regla (b).
  if (/^\s*\[[^\]]*\]\s*$/.test(t)) return 'linea toda entre corchetes (CTR-09)';
  // La segunda regla de verso del schema, espejada: al menos una palabra de cuatro
  // letras. "uh uh uh" o "no no no" pueden ser canto de verdad, pero como enunciado de
  // este juego no identifican nada — y el schema los rechazaria de todos modos.
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{4,}/.test(t)) return 'sin ninguna palabra de cuatro letras (CTR-09)';
  if (ROTULO_LIBRE.test(t)) return 'rotulo de tramo con nombre libre (CNT-11 a)';
  if (esSecuenciaDeAcordes(t)) return 'secuencia de acordes sueltos (CNT-11 b)';
  if (esRenglonDeCifra(t)) return 'renglon de cifra: sangria ancha o acorde con estructura (FIND-30)';
  if (esCredito(t)) return 'linea de credito de la fuente (CNT-11 c)';
  // `FIND-30`: "Repite introducion" es una nota del transcriptor que no arranca con
  // "nota:". Se suma la familia entera de verbos de indicacion.
  if (/^(nota|pd|repet[ie]|repite|bis)\b/i.test(t)) return 'nota del transcriptor (CNT-11 d)';
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
/**
 * Saca la anotación que el transcriptor pega al final de un verso cantado.
 *
 * `"y tu sombra va detrás (Fill 1)"` es un verso **bueno** con basura colgada: descartarlo
 * entero sería perder letra real por culpa de un paréntesis. Se limpia y se queda.
 *
 * Solo cae el paréntesis final **si todo lo que hay adentro es no-letra** — así los coros
 * cantados entre paréntesis, que el corpus tiene de a montones (`"(el tic no alcanza a
 * tac)"`, `"(mientras bailamos tangos fatales)"`), no se tocan.
 */
function sinAnotacionFinal(texto: string): string {
  const m = /^(.*\S)\s*\(([^()]*)\)\s*\.?\s*$/.exec(texto.trim());
  if (!m) return texto.trim();
  const adentro = m[2]!.split(/\s+/).filter(Boolean);
  if (adentro.length === 0 || !adentro.every(noAportaLetra)) return texto.trim();
  return m[1]!.trim();
}

export function versosUtilizables(lineas: readonly VersoDelTema[]): VersoDelTema[] {
  const vistos = new Set<string>();
  const salida: VersoDelTema[] = [];
  for (const v of lineas) {
    if (motivoDescarteVerso(v.texto) !== null) continue;
    const limpio = sinAnotacionFinal(v.texto);
    // La limpieza puede dejar algo que ya no sirve como verso: se vuelve a chequear.
    if (!limpio || motivoDescarteVerso(limpio) !== null) continue;
    const llave = normalizarDuro(limpio);
    if (llave.length === 0 || vistos.has(llave)) continue;
    vistos.add(llave);
    salida.push({ ...v, texto: limpio });
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
