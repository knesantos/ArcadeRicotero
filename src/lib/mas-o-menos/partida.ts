/**
 * La partida de "Más o menos" (`US-10`, `D-48`, `CTR-20`).
 *
 * Cada paso es una pregunta con respuesta de número y una referencia de la misma unidad.
 * El jugador dice "más" o "menos" (para los años, "después" o "antes", que es lo mismo
 * dicho como se dice). Un error corta y el puntaje es la racha: es el *Higher Lower Game*
 * (`RES-93`), con la encuesta de *Card Sharks* adentro para que la pregunta pueda ser de
 * cualquier cosa (`RES-95`).
 *
 * ## Las tres reglas que ordenan el sorteo
 *
 * 1. **La familia rota, como un mazo.** Las familias salen de una bolsa barajada: en cada
 *    vuelta pasan todas las que tienen datos, una vez cada una, en orden al azar, y la
 *    primera de una vuelta nunca es la última de la anterior. Es la variedad que pidió el
 *    usuario ("no todo sobre las letras"), garantizada y no librada a la suerte: el primer
 *    intento sorteaba la familia de a una, y en una de cada tantas partidas los siete
 *    primeros pasos traían cuatro familias. El test lo cazó.
 * 2. **Cada familia pesa lo mismo.** Se elige primero la familia y después el dato. Si se
 *    sorteara el dato, los 94 temas con duración taparían a los datos de la banda.
 * 3. **Un dato usado no vuelve**, tampoco el que se mostró como referencia de un par: su
 *    número ya se vio, y preguntarlo después sería regalarlo.
 *
 * El estado se muta a propósito y en un solo lugar: la isla guarda un objeto y le pide el
 * paso siguiente. No hay nada que sincronizar con el DOM.
 */

import { escalon, lejosParaPar, referenciaNumero, type Azar, type Escala } from './referencia.ts';

export type Familia =
  | 'la-banda'
  | 'la-gente'
  | 'los-recitales'
  | 'los-discos'
  | 'lo-que-dura'
  | 'en-vivo'
  | 'las-palabras';

/** Las siete, en el orden en que se nombran. */
export const FAMILIAS: readonly Familia[] = [
  'la-banda',
  'la-gente',
  'los-recitales',
  'los-discos',
  'lo-que-dura',
  'en-vivo',
  'las-palabras',
];

/** Un tema del cancionero, para la lista de "en cuáles" de una palabra. */
export interface TemaDeLaLista {
  readonly slug: string;
  readonly titulo: string;
}

/**
 * Un dato del pozo, tal como lo ve la isla (`CTR-20`, "qué viaja al navegador").
 *
 * Los de la banda vienen del JSON; los demás se derivan en build de fichas del repo
 * (`datos.ts`). Acá ya no se distinguen: una pregunta, un número y de dónde salió.
 */
export interface Dato {
  readonly id: string;
  readonly familia: Familia;
  /** La llave de los pares: solo se enfrentan datos de la misma medida. */
  readonly medida: string;
  readonly pregunta: string;
  /**
   * Lo que se nombra cuando el dato es la referencia de un par: «Jijiji», «Oktubre», el
   * Indio. La pantalla lo pone en chico arriba del número (`UX-34` §3.2).
   */
  readonly sujeto?: string;
  readonly valor: number;
  readonly escala: Escala;
  readonly unidad?: readonly [string, string];
  /**
   * El máximo que puede tener el número real: los setlists cargados, los temas contados.
   * La referencia queda por debajo (`CTR-20.5`). Solo `palabra` y `en-vivo`.
   */
  readonly techo?: number;
  /** Registro 3: de dónde salió el número. */
  readonly fuente: string;
  /** Una línea que se lee al revelar, si el dato la trae. */
  readonly explicacion?: string;
  /** Solo las palabras: qué formas se contaron y en qué temas aparecen. */
  readonly formas?: readonly string[];
  readonly temas?: readonly TemaDeLaLista[];
}

export type Eleccion = 'mas' | 'menos';

export type Referencia =
  | { readonly clase: 'numero'; readonly valor: number }
  | { readonly clase: 'par'; readonly dato: Dato };

export interface Paso {
  readonly dato: Dato;
  readonly referencia: Referencia;
  /** "mas" si la respuesta real es mayor que la referencia (para un año: después). */
  readonly correcta: Eleccion;
}

export interface EstadoPartida {
  readonly pozo: readonly Dato[];
  readonly usados: Set<string>;
  racha: number;
  ultimaFamilia: Familia | null;
  /** Las familias que faltan salir en esta vuelta del mazo. */
  bolsa: Familia[];
  terminada: boolean;
  /** `true` si terminó porque no quedaban preguntas, no por un error. */
  ganada: boolean;
}

/** El valor de la referencia, sea de la clase que sea. */
export function valorDeReferencia(r: Referencia): number {
  return r.clase === 'numero' ? r.valor : r.dato.valor;
}

/**
 * La probabilidad de que un paso vaya de par cuando se puede. La mitad: los dos formatos
 * se alternan sin patrón, y ninguno se vuelve el único.
 */
export const CHANCE_DE_PAR = 0.5;

export function nuevaPartida(pozo: readonly Dato[]): EstadoPartida {
  const ids = new Set<string>();
  for (const d of pozo) {
    if (ids.has(d.id)) throw new Error(`dato repetido en el pozo: ${d.id}`);
    ids.add(d.id);
  }
  return { pozo, usados: new Set(), racha: 0, ultimaFamilia: null, bolsa: [], terminada: false, ganada: false };
}

function alAzar<T>(lista: readonly T[], azar: Azar): T {
  return lista[Math.min(lista.length - 1, Math.floor(azar() * lista.length))]!;
}

/** Fisher–Yates con el azar inyectado. */
function barajar<T>(lista: readonly T[], azar: Azar): T[] {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(azar() * (i + 1)));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/**
 * La familia del paso siguiente, sacada de la bolsa (regla 1).
 *
 * Una familia que se quedó sin datos a mitad de vuelta se saltea. Cuando la bolsa se vacía
 * se rellena con las que tienen datos, barajadas, y si la primera coincide con la última
 * que salió se la manda al fondo — salvo que sea la única que queda.
 */
function sacarFamilia(estado: EstadoPartida, conDatos: readonly Familia[], azar: Azar): Familia {
  estado.bolsa = estado.bolsa.filter((f) => conDatos.includes(f));
  if (estado.bolsa.length === 0) {
    const nueva = barajar(conDatos, azar);
    if (nueva.length > 1 && nueva[0] === estado.ultimaFamilia) nueva.push(nueva.shift()!);
    estado.bolsa = nueva;
  }
  return estado.bolsa.shift()!;
}

/**
 * El paso siguiente, o `null` si ya no quedan preguntas (y entonces la partida está ganada).
 *
 * Marca como usados el dato y, si va de par, el de la referencia.
 */
export function siguientePaso(estado: EstadoPartida, azar: Azar): Paso | null {
  if (estado.terminada) return null;
  const libres = estado.pozo.filter((d) => !estado.usados.has(d.id));
  if (libres.length === 0) {
    estado.terminada = true;
    estado.ganada = true;
    return null;
  }

  // 1 y 2: primero la familia, del mazo; después el dato, dentro de ella.
  const conDatos = FAMILIAS.filter((f) => libres.some((d) => d.familia === f));
  const familia = sacarFamilia(estado, conDatos, azar);

  const dato = alAzar(
    libres.filter((d) => d.familia === familia),
    azar,
  );

  // El par: otro dato libre de la misma medida, a la distancia del escalón.
  const rivales = libres.filter(
    (d) => d.id !== dato.id && d.medida === dato.medida && lejosParaPar(dato.valor, d.valor, dato.escala, estado.racha),
  );
  let referencia: Referencia;
  if (rivales.length > 0 && azar() < CHANCE_DE_PAR) {
    referencia = { clase: 'par', dato: alAzar(rivales, azar) };
  } else {
    referencia = { clase: 'numero', valor: referenciaNumero(dato.valor, dato.escala, estado.racha, azar, dato.techo) };
  }

  estado.usados.add(dato.id);
  if (referencia.clase === 'par') estado.usados.add(referencia.dato.id);
  estado.ultimaFamilia = familia;

  const ref = valorDeReferencia(referencia);
  if (ref === dato.valor) throw new Error(`empate en ${dato.id}: la referencia no puede ser la respuesta`);
  return { dato, referencia, correcta: dato.valor > ref ? 'mas' : 'menos' };
}

/** Anota la respuesta del jugador. Devuelve si acertó; un error termina la partida. */
export function responder(estado: EstadoPartida, paso: Paso, eleccion: Eleccion): boolean {
  if (estado.terminada) throw new Error('la partida ya terminó');
  const acerto = eleccion === paso.correcta;
  if (acerto) estado.racha += 1;
  else estado.terminada = true;
  return acerto;
}

/**
 * El tramo del encabezado del resultado (`US-10`): bajo 0–2, medio 3–7, alto 8+.
 *
 * Tres aciertos seguidos por azar puro en un toque binario salen una de cada ocho veces;
 * ocho, una de cada 256. El bajo es donde cae la suerte y el alto es de quien sabe.
 */
export type Tramo = 'bajo' | 'medio' | 'alto';

export function tramoDeRacha(racha: number): Tramo {
  if (racha >= 8) return 'alto';
  if (racha >= 3) return 'medio';
  return 'bajo';
}

/** El escalón en que está la partida: lo usa la pantalla para decir cuánto se afinó. */
export function escalonDe(estado: EstadoPartida): number {
  return escalon(estado.racha);
}

/**
 * El azar de la isla con semilla, para los tests y para reproducir una partida.
 * Es `mulberry32`: chico, sin dependencias y bien repartido para esto.
 */
export function azarConSemilla(semilla: number): Azar {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
