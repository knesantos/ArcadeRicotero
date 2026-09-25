/**
 * La referencia de "Más o menos" (`US-10`, `D-48` puntos 2, 8 y 9, `CTR-20.5` y `CTR-20.6`):
 * el número contra el que el jugador dice "más" o "menos", y a qué distancia de la
 * respuesta se pone.
 *
 * ## Por qué la pone el juego y no el dato
 *
 * La misma pregunta tiene que servir fácil al principio y difícil después (`D-48`,
 * alternativa 5). Si la referencia la escribiera `contenido`, cada pregunta tendría una
 * sola dificultad para siempre. Acá la distancia sale de la racha: arranca lejos —"¿tocaron
 * más o menos que 3 años?" se contesta con el sentido común, que es el molinete de `D-09`— y
 * se acerca a medida que el jugador demuestra que sabe.
 *
 * ## Las tres escalas
 *
 * Un año, una duración y una cantidad no se alejan igual. Diez años de distancia en un año
 * es mucho; diez unidades en una cantidad de 80.000 no es nada. Por eso cada escala tiene
 * su regla: el año y la duración se corren **sumando**, la cantidad **multiplicando**.
 *
 * ## La regla que ordena los bordes (`CTR-20.5`)
 *
 * **La referencia nunca cae donde la respuesta se sabe sin saber.** Ningún conteo es 0 y no
 * hay empates, así que "¿más o menos que 1?" es siempre "más": la cantidad arranca en 2.
 * Nada pasa de hoy, así que "¿antes o después de 2026?" es siempre "antes": el año llega a
 * 2025. Una canción de diez segundos no existe: la duración arranca en 0:30. Y un tema no
 * figura en más setlists de los que se cargaron: el dato que tiene `techo` lo respeta.
 *
 * Sin `node:fs` y sin `Math.random`: el azar entra de afuera, así el test es determinista y
 * el navegador usa el suyo.
 */

export type Escala = 'anio' | 'entero' | 'segundos';

/** El azar, inyectado: un número en `[0, 1)`. */
export type Azar = () => number;

/**
 * Los cuatro escalones de la racha: 0–2, 3–5, 6–9, 10+.
 *
 * Tres aciertos para salir del primero es lo que tarda en irse la suerte: con referencias
 * lejanas, el que no sabe nada acierta casi siempre, y eso está bien (`D-09`). Desde el
 * cuarto ya hay que saber algo.
 */
export const DESDE_RACHA = [0, 3, 6, 10] as const;

export type Escalon = 0 | 1 | 2 | 3;

export function escalon(racha: number): Escalon {
  if (racha >= DESDE_RACHA[3]) return 3;
  if (racha >= DESDE_RACHA[2]) return 2;
  if (racha >= DESDE_RACHA[1]) return 1;
  return 0;
}

/**
 * Cuánto se aleja la referencia, por escala y escalón (`CTR-20.5`).
 *
 * - `anio`: años de distancia, sumados o restados.
 * - `segundos`: segundos de distancia.
 * - `entero`: el factor por el que se multiplica o se divide.
 */
export const DISTANCIA: Readonly<Record<Escala, readonly (readonly [number, number])[]>> = {
  anio: [
    [8, 12],
    [4, 6],
    [2, 3],
    [1, 1],
  ],
  segundos: [
    [120, 180],
    [60, 90],
    [30, 45],
    [10, 20],
  ],
  entero: [
    [2.5, 3.5],
    [1.7, 2],
    [1.3, 1.5],
    [1.1, 1.2],
  ],
};

/**
 * La franja del par, por escala y escalón (`CTR-20.6`): la distancia entre los dos valores
 * tiene que ser al menos el piso de su escalón y **menos que el piso del anterior**. Con piso
 * solo, a racha 10+ entraba *Jijiji* (101) contra *Scaramanzia* (5): un punto regalado, y como
 * el par sale la mitad de las veces que se puede, medio juego volvía a ser de sentido común.
 */
export const PISO_DEL_PAR: Readonly<Record<Escala, readonly number[]>> = {
  anio: [8, 4, 2, 1],
  segundos: [120, 60, 30, 10],
  entero: [2.5, 1.7, 1.3, 1],
};

/** El año de hoy: nada de la banda pasa de acá. La referencia queda por debajo (`CTR-20.5`). */
export const ANIO_TOPE = 2026;

/** La referencia más chica en `entero`: con 1, la respuesta sería siempre "más". */
export const ENTERO_PISO = 2;

/** La referencia más chica en `segundos`: el tema más corto del pozo dura 0:53. */
export const SEGUNDOS_PISO = 30;

/** En `segundos`, la referencia queda por lo menos a esto de la respuesta, ya redondeada. */
export const SEGUNDOS_DISTANCIA_MINIMA = 10;

function entre(azar: Azar, [desde, hasta]: readonly [number, number]): number {
  return desde + azar() * (hasta - desde);
}

/**
 * El paso de redondeo de una cantidad: nadie dice "¿más o menos que 71.340 personas?".
 *
 * Menos de 20, de a uno; menos de 200, de a cinco; menos de 2.000, de a cincuenta; de ahí
 * para arriba, dos cifras significativas.
 */
export function pasoDeRedondeo(valor: number): number {
  const v = Math.abs(valor);
  if (v < 20) return 1;
  if (v < 200) return 5;
  if (v < 2000) return 50;
  return 10 ** (Math.floor(Math.log10(v)) - 1);
}

/** ¿Está esta referencia dentro del dominio de su escala (`CTR-20.5`, la tabla)? */
function enDominio(ref: number, escala: Escala, techo?: number): boolean {
  if (escala === 'entero') return ref >= ENTERO_PISO && (techo === undefined || ref <= techo - 1);
  if (escala === 'anio') return ref < ANIO_TOPE;
  return ref >= SEGUNDOS_PISO;
}

/**
 * La referencia número para un dato, según la racha (`CTR-20.5`, el algoritmo).
 *
 * **Garantías, y son las que hacen que el juego no mienta:** es entera, nunca es igual a la
 * respuesta (no hay empates, `D-48` punto 9), está del lado que se sorteó y queda en el
 * dominio de su escala. Si el redondeo pisó o cruzó la respuesta, se corre un paso para su
 * lado; si un lado no tiene lugar, se prueba el otro con otro sorteo.
 *
 * `techo`: el máximo que puede tener el número real (los setlists cargados, los temas
 * contados). La referencia queda por debajo.
 */
export function referenciaNumero(
  valor: number,
  escala: Escala,
  racha: number,
  azar: Azar,
  techo?: number,
): number {
  if (!Number.isFinite(valor)) throw new RangeError(`valor no finito: ${valor}`);
  const rango = DISTANCIA[escala][escalon(racha)]!;

  const candidata = (arriba: boolean): number | null => {
    let ref: number;
    if (escala === 'entero') {
      const paso = pasoDeRedondeo(valor);
      const factor = entre(azar, rango);
      ref = Math.round((arriba ? valor * factor : valor / factor) / paso) * paso;
      // El redondeo pudo pisar la respuesta o cruzarla: se corre un paso para su lado.
      if (arriba && ref <= valor) ref = Math.floor(valor / paso) * paso + paso;
      if (!arriba && ref >= valor) ref = Math.ceil(valor / paso) * paso - paso;
    } else if (escala === 'anio') {
      const distancia = Math.round(entre(azar, rango));
      ref = arriba ? valor + distancia : valor - distancia;
    } else {
      const distancia = Math.round(entre(azar, rango));
      ref = Math.round((arriba ? valor + distancia : valor - distancia) / 5) * 5;
      // A diez segundos o más, ya redondeada: la referencia no puede ser más fina que el par.
      while (Math.abs(ref - valor) < SEGUNDOS_DISTANCIA_MINIMA || (arriba ? ref <= valor : ref >= valor)) {
        ref += arriba ? 5 : -5;
      }
    }
    return enDominio(ref, escala, techo) ? ref : null;
  };

  const primero = azar() < 0.5;
  const ref = candidata(primero) ?? candidata(!primero);
  if (ref === null) throw new RangeError(`sin referencia posible para ${valor} en ${escala}`);
  return ref;
}

/**
 * ¿Pueden ir estos dos valores en par, en esta racha? (`CTR-20.6`)
 *
 * La distancia —la diferencia en `anio` y `segundos`, el cociente mayor/menor en `entero`—
 * tiene que caer en la franja del escalón: al menos su piso, y menos que el piso del
 * anterior. Dos valores iguales no van nunca.
 */
export function lejosParaPar(a: number, b: number, escala: Escala, racha: number): boolean {
  if (a === b) return false;
  const e = escalon(racha);
  const distancia =
    escala === 'entero' ? Math.max(a, b) / Math.max(Math.min(a, b), Number.MIN_VALUE) : Math.abs(a - b);
  const piso = PISO_DEL_PAR[escala][e]!;
  const debajoDe = e > 0 ? PISO_DEL_PAR[escala][e - 1]! : Infinity;
  if (escala === 'entero' && e === 3) return distancia > 1 && distancia < debajoDe;
  return distancia >= piso && distancia < debajoDe;
}
