/**
 * La solución grabada de Skayboy y Poligirl (`CTR-18`, `T-267`): **cómo se escribe una traza,
 * cómo se repite y qué se le exige.**
 *
 * ## Por qué es un módulo aparte
 *
 * Una traza la juegan tres: `soluciones.test.ts` en cada build, `scripts/resolver-niveles.mjs`
 * cuando la graba, y el solucionador cuando la busca y la ensancha. `CTR-18.11` pide que los
 * tres usen **la misma función** para repetirla, medirle la tolerancia y contarle la paridad:
 * dos copias de una regla son dos reglas, y un día dan dos números. Hasta `T-267` todo esto
 * vivía adentro del solucionador (`T-266`), escrito para mudarse entero; acá está mudado, con
 * la gramática del renglón que faltaba.
 *
 * ## Qué hay, en el orden del contrato
 *
 * 1. **La traza como mandos**: corridas de cuadros con el mismo mando, expandir y compactar.
 * 2. **El renglón** (`CTR-18.3`): la gramática, con **una sola expresión** —la misma cadena que
 *    el `pattern` del schema—, para leer y para escribir.
 * 3. **La repetición** (`CTR-18.5`) y lo que el test le exige (`CTR-18.6`, reglas 5 a 7 y 11), con
 *    el comando que regraba al final de cada mensaje.
 * 4. **La paridad** (`CTR-18.8`), contada sobre el suceso `compuerta` de `CTR-16.10.7`, que el
 *    mundo emite desde `T-272`.
 * 5. **La tolerancia** (`ADR-09.5`, `CTR-18.7`) y el mínimo de `BR-29` por escalón.
 *
 * ## Lo que no importa, ni quién lo importa (`CTR-18.11`)
 *
 * Nada fuera de `mundo.ts` y `niveles.ts`: ni `node:*`, ni el motor, ni el DOM. El archivo de
 * soluciones lo abre quien llama y le pasa lo que leyó. **Y no lo importa la isla ni ninguna
 * página**: la traza no viaja al teléfono (`ADR-09.2`), y eso lo vigila la regla 10 de
 * `soluciones.test.ts`.
 *
 * ## Cómo se nombran los cuadros en los mensajes
 *
 * «cuadro t» es el índice desde cero, el mismo que imprime el script en «desde t»; «N
 * cuadros» es una cuenta. Los renglones de una traza, en cambio, se cuentan desde uno, como se
 * leen en el archivo.
 */

import {
  CUADRO_SEG,
  CUERPO_ALTO,
  CUERPO_ANCHO,
  PERSONAJES,
  QUIETO,
  TILE,
  crearMundo,
  paso,
  type Caja,
  type Cuerpo,
  type Espera,
  type Mando,
  type Mandos,
  type Mundo,
  type Suceso,
} from './mundo.ts';
import { tramosDeCompuertas, type Banco, type IdPersonaje, type Nivel, type TramoDeCompuerta } from './niveles.ts';

/* =========================================================================================
   1. La traza como mandos
   ========================================================================================= */

/** Un tramo de la traza: los mismos mandos durante `cuadros` cuadros seguidos. */
export interface Corrida {
  readonly mandos: Mandos;
  readonly cuadros: number;
}

/**
 * Una traza: la lista de corridas que, expandida, da un `Mandos` por cuadro, jugados a
 * `CUADRO_SEG`. **Compacta** quiere decir sin corridas vacías y sin dos seguidas iguales: es
 * como la devuelve todo lo de este módulo, y es la forma canónica de `CTR-18.3` dicha en
 * mandos, porque en la traza de uno cada corrida es un renglón.
 */
export type Traza = readonly Corrida[];

/** Las tres teclas de una columna (`UX-28 §2.1`). */
export const TECLAS = ['izquierda', 'derecha', 'saltar'] as const;
export type Tecla = (typeof TECLAS)[number];

function mando(izquierda: boolean, derecha: boolean, saltar: boolean): Mando {
  return { izquierda, derecha, saltar };
}

/** Una copia plana, para que dos trazas iguales se comparen con `deepEqual` sin sorpresas. */
function mandosPlanos(m: Mandos): Mandos {
  return {
    skayboy: mando(m.skayboy.izquierda, m.skayboy.derecha, m.skayboy.saltar),
    poligirl: mando(m.poligirl.izquierda, m.poligirl.derecha, m.poligirl.saltar),
  };
}

export function mismosMandos(a: Mandos, b: Mandos): boolean {
  for (const id of PERSONAJES) {
    const x = a[id];
    const y = b[id];
    if (x.izquierda !== y.izquierda || x.derecha !== y.derecha || x.saltar !== y.saltar) return false;
  }
  return true;
}

/** Si la columna tiene alguna tecla apretada. Es lo que el mundo llama `conDedo`. */
export function tieneTeclas(m: Mando): boolean {
  return m.izquierda || m.derecha || m.saltar;
}

export function columnasConTeclas(m: Mandos): IdPersonaje[] {
  return PERSONAJES.filter((id) => tieneTeclas(m[id]));
}

/**
 * **El que espera** en ese cuadro: si una sola columna tiene teclas, el de la otra. Es a quien
 * mira la regla 7 de `CTR-18.6`. Sin teclas no espera nadie —el último que jugó puede terminar
 * de caer—, y con las dos tampoco. La usan la repetición y la búsqueda, así que las dos miran
 * exactamente los mismos cuadros.
 */
export function queEspera(m: Mandos): IdPersonaje | null {
  const columnas = columnasConTeclas(m);
  if (columnas.length !== 1) return null;
  return columnas[0] === 'skayboy' ? 'poligirl' : 'skayboy';
}

/** Un `Mandos` por cuadro. Los cuadros de una corrida comparten el objeto: nadie lo muta. */
export function expandir(traza: Traza): Mandos[] {
  const cuadros: Mandos[] = [];
  for (const corrida of traza) {
    for (let i = 0; i < corrida.cuadros; i++) cuadros.push(corrida.mandos);
  }
  return cuadros;
}

/** Junta los cuadros iguales seguidos. `compactar(expandir(t))` es `t` si `t` es compacta. */
export function compactar(cuadros: readonly Mandos[]): Traza {
  const traza: { mandos: Mandos; cuadros: number }[] = [];
  for (const m of cuadros) {
    const ultima = traza[traza.length - 1];
    if (ultima !== undefined && mismosMandos(ultima.mandos, m)) ultima.cuadros++;
    else traza.push({ mandos: mandosPlanos(m), cuadros: 1 });
  }
  return traza;
}

export function esCompacta(traza: Traza): boolean {
  return traza.every(
    (c, i) =>
      Number.isInteger(c.cuadros) && c.cuadros >= 1 && (i === 0 || !mismosMandos(traza[i - 1].mandos, c.mandos)),
  );
}

export function largoDe(traza: Traza): number {
  return traza.reduce((suma, c) => suma + c.cuadros, 0);
}

/** Los primeros `cuadros` de la traza, compactos. Es como el script recorta una traza que gana antes. */
export function recortar(traza: Traza, cuadros: number): Traza {
  return compactar(expandir(traza).slice(0, cuadros));
}

/* =========================================================================================
   2. El renglón (CTR-18.3)
   ========================================================================================= */

/**
 * La gramática de `CTR-18.3`: quién (`s`, `p` o `-`), las teclas, un espacio y los cuadros.
 * **Es, carácter por carácter, la misma cadena que el `pattern` de
 * `src/data/_schema/skayboy-soluciones.schema.json`**, con los mismos grupos —quién, teclas,
 * cuadros—, y `soluciones.test.ts` compara las dos: dos gramáticas escritas por separado son dos
 * gramáticas que un día aceptan cosas distintas (`FIND-58`).
 *
 * Lo que la expresión hace imposible es lo que importa: **un renglón nombra una columna o
 * ninguna**, así que la persona sola no tiene dónde escribir las dos a la vez (`BR-25` b y c).
 */
export const EXPRESION_RENGLON = '^(?:([sp])(<\\^|>\\^|<|>|\\^)|-) ([1-9][0-9]{0,3})$';

const RENGLON = new RegExp(EXPRESION_RENGLON, 'u');

/** Se nombra al personaje y no a la columna de la pantalla: la traza le habla a `mundo.ts`. */
const LETRA: Readonly<Record<IdPersonaje, 's' | 'p'>> = { skayboy: 's', poligirl: 'p' };
const DE_LA_LETRA: Readonly<Record<string, IdPersonaje>> = { s: 'skayboy', p: 'poligirl' };

/** El techo de cuadros de un renglón: cuatro dígitos. */
const MAX_CUADROS_POR_RENGLON = 9999;

/**
 * Por qué un renglón no cumple la expresión, dicho de manera que se pueda corregir. El caso de
 * las dos columnas va primero y con su nombre: es la regla 4 de `CTR-18.6`, y el mensaje tiene
 * que decir que nombra dos columnas, no que "no es válido".
 */
function porQueNoSeLee(texto: string): string {
  if (/^[sp]\S* +[sp]\S* +\S+$/u.test(texto)) {
    return 'nombra dos columnas: una persona sola toca una por vez (CTR-18.3, BR-25 b y c)';
  }
  const teclas = /^[sp](\S*) /u.exec(texto)?.[1] ?? '';
  if (teclas.includes('<') && teclas.includes('>')) {
    return 'trae «<>», que no existe: las dos a la vez se anulan y «^» solo hace lo mismo (CTR-18.3)';
  }
  const numero = / (\d+)$/u.exec(texto)?.[1];
  if (numero !== undefined && (/^0/u.test(numero) || Number(numero) > MAX_CUADROS_POR_RENGLON)) {
    return `los cuadros van de 1 a ${MAX_CUADROS_POR_RENGLON}, sin ceros a la izquierda (CTR-18.3)`;
  }
  return 'no es un renglón de CTR-18.3: quién (s, p o -), sus teclas (<, >, ^, <^ o >^), un espacio y los cuadros';
}

export interface Lectura {
  /** La traza, si todos los renglones se leen; si alguno no, `null`. */
  readonly traza: Traza | null;
  /** Cada renglón que no se lee o que rompe la forma canónica. Vacío: la traza está sana. */
  readonly problemas: readonly string[];
}

/**
 * Lee los renglones de un nivel, y mira las reglas 3 y 4 de `CTR-18.6`: **cada renglón cumple
 * la expresión**; **ninguno nombra dos columnas** —el formato lo hace imposible, y esto prueba
 * que el lector no deja pasar la excepción—; y la forma es **canónica**: dos renglones seguidos
 * con el mismo mando son uno solo, porque expandidos dan lo mismo cuadro a cuadro.
 *
 * Un renglón que no es canónico se lee igual —la física no cambia— pero es un problema: el
 * script siempre escribe la forma canónica, y un diff tiene que decir una cosa de una manera.
 */
export function leerTraza(id: string, renglones: readonly string[]): Lectura {
  const problemas: string[] = [];
  const traza: Corrida[] = [];
  let legible = renglones.length > 0;
  if (renglones.length === 0) problemas.push(`${id}: la traza no tiene ningún renglón`);
  let previo: { readonly numero: number; readonly mandos: Mandos } | null = null;

  renglones.forEach((texto, i) => {
    const numero = i + 1;
    const m = typeof texto === 'string' ? RENGLON.exec(texto) : null;
    if (m === null) {
      problemas.push(`${id}, renglón ${numero}: «${String(texto)}» ${porQueNoSeLee(String(texto))}`);
      legible = false;
      previo = null;
      return;
    }
    const columna = m[1] === undefined ? null : DE_LA_LETRA[m[1]];
    const teclas = m[2] ?? '';
    const deLaColumna = mando(teclas.includes('<'), teclas.includes('>'), teclas.includes('^'));
    const mandos: Mandos = {
      skayboy: columna === 'skayboy' ? deLaColumna : QUIETO,
      poligirl: columna === 'poligirl' ? deLaColumna : QUIETO,
    };
    if (previo !== null && mismosMandos(previo.mandos, mandos)) {
      problemas.push(`${id}, renglón ${numero}: igual al ${previo.numero}, y dos renglones seguidos con el mismo mando son uno solo (CTR-18.3)`);
    }
    traza.push({ mandos, cuadros: Number(m[3]) });
    previo = { numero, mandos };
  });

  return { traza: legible ? traza : null, problemas };
}

/**
 * Escribe una traza en renglones, en la forma canónica: compacta primero, así que dos corridas
 * seguidas con el mismo mando salen en un renglón. **Tira** si la traza no se puede escribir:
 * un cuadro con las dos columnas —no es la traza de uno—, un `<>`, o una corrida de más de
 * cuatro dígitos. Es el único escritor de renglones del repo.
 */
export function escribirTraza(traza: Traza): string[] {
  return compactar(expandir(traza)).map((c, i) => {
    const donde = `corrida ${i + 1}`;
    const columnas = columnasConTeclas(c.mandos);
    if (columnas.length > 1) {
      throw new Error(`${donde}: las dos columnas tienen teclas, y la traza de uno no tiene cómo escribirlo (CTR-18.3)`);
    }
    if (c.cuadros > MAX_CUADROS_POR_RENGLON) {
      throw new Error(`${donde}: ${c.cuadros} cuadros no entran en un renglón (hasta ${MAX_CUADROS_POR_RENGLON}, CTR-18.3)`);
    }
    const quien = columnas[0];
    if (quien === undefined) return `- ${c.cuadros}`;
    const m = c.mandos[quien];
    if (m.izquierda && m.derecha) throw new Error(`${donde}: «<>» no existe en CTR-18.3`);
    const teclas = (m.izquierda ? '<' : m.derecha ? '>' : '') + (m.saltar ? '^' : '');
    return `${LETRA[quien]}${teclas} ${c.cuadros}`;
  });
}

/* =========================================================================================
   3. La repetición (CTR-18.5) y lo que se le exige (CTR-18.6, reglas 5 a 7)
   ========================================================================================= */

/**
 * En el piso y sin un salto guardado. **Es la condición para soltar una columna**: con
 * `QUIETO`, un cuerpo así no se mueve ni un píxel, en ningún cuadro, para siempre.
 *
 * `enSuelo` solo no alcanza, y no es un detalle: un toque de saltar justo antes de aterrizar
 * queda guardado (`PERDON_TEMPRANO_SEG`), y si en ese momento se suelta la columna, el cuerpo
 * salta solo al tocar el piso — sin dedo encima. Sería exactamente el que espera moviéndose,
 * que es lo que `BR-25` (d) prohíbe.
 */
export function enElPiso(c: Cuerpo): boolean {
  return c.enSuelo && c.saltoGuardado === 0;
}

export interface Repeticion {
  readonly gana: boolean;
  /** Los cuadros jugados hasta el que gana, ese incluido. Si no gana, los de la traza entera. */
  readonly cuadros: number;
  /**
   * Los cuadros que la traza trae **después** de ganar. Una traza grabada no trae ninguno: si
   * trajera, recortarla un cuadro seguiría ganando, y el rojo de `T-267` no probaría nada.
   */
  readonly sobrantes: number;
  /** El reloj del mundo al terminar: lo que dura el nivel jugado así. */
  readonly segundos: number;
  readonly vueltas: Readonly<Record<IdPersonaje, number>>;
  /** Las vueltas de un cuerpo que en ese cuadro no tenía ninguna tecla apretada (`BR-25` d). */
  readonly vueltasSinDedo: Readonly<Record<IdPersonaje, number>>;
  /** La primera vuelta, para que el mensaje diga cuadro y quién (`CTR-18.6` regla 6). */
  readonly primeraVuelta: { readonly cuadro: number; readonly quien: IdPersonaje; readonly conDedo: boolean } | null;
  /** 0, 1 o 2. En la traza de uno, nunca 2 (`BR-25` b y c). */
  readonly maxColumnasConTeclas: number;
  /** El primer cuadro con teclas en las dos columnas, para el mensaje. */
  readonly primerCuadroConDos: number | null;
  /** Cuadros en que la única columna con teclas no es la última que las tuvo. */
  readonly cambiosDeColumna: number;
  /** De esos, en cuántos alguno de los dos no estaba en el piso. La de uno no tiene ninguno. */
  readonly cambiosSinPiso: number;
  /**
   * Cuadros en que una sola columna tiene teclas y el cuerpo de la otra **no termina donde
   * empezó** (`CTR-18.6` regla 7: el que espera no se mueve). Los cuadros sin ninguna tecla no
   * cuentan: ahí el último que jugó puede terminar de caer.
   */
  readonly movimientosDelQueEspera: number;
  readonly primerMovimientoDelQueEspera: {
    readonly cuadro: number;
    readonly quien: IdPersonaje;
    readonly desde: { readonly x: number; readonly y: number };
    readonly hasta: { readonly x: number; readonly y: number };
  } | null;
  /**
   * **Regla 11 de `CTR-18.6`, primera mitad**: cuadros en que alguna caja tuvo que esperar a un
   * cuerpo (`CTR-16.10.5`). Se mira en **cada** cuadro, no solo en los cambios de columna: la
   * carrera que la produce es la del que juega con su propia caja.
   */
  readonly cuadrosConCajaEnEspera: number;
  readonly primeraEspera: (Espera & { readonly cuadro: number }) | null;
  /**
   * **Regla 11, segunda mitad**: cambios de columna con alguna caja todavía andando, en su tramo
   * o cayendo (`CTR-16.10.11`). La persona sola suelta a uno con la sala quieta.
   */
  readonly cambiosConCajaAndando: number;
  readonly primerCambioConCajaAndando: {
    readonly cuadro: number;
    readonly quien: IdPersonaje;
    readonly empujadaPor: IdPersonaje | null;
  } | null;
  readonly sucesos: {
    readonly saltos: Readonly<Record<IdPersonaje, number>>;
    readonly tesoros: Readonly<Record<IdPersonaje, number>>;
    readonly puerta: number;
  };
  /** Quién le abrió paso a quién en esta partida (`CTR-18.8`). */
  readonly paridad: Paridad;
  /** Dónde quedó cada uno al terminar: lo que nombra el "no gana" (`CTR-18.6` regla 5). */
  readonly final: Readonly<
    Record<IdPersonaje, { readonly x: number; readonly y: number; readonly enPuerta: boolean }>
  >;
}

function porPersonaje(): Record<IdPersonaje, number> {
  return { skayboy: 0, poligirl: 0 };
}

function posiciones(mundo: Mundo): Posiciones {
  return {
    skayboy: { x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y },
    poligirl: { x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y },
  };
}

/**
 * **La regla 7 de `CTR-18.6`**: el que espera termina el cuadro donde lo empezó, x e y,
 * comparados con `===`. Está aparte para poder probar cada eje por separado: en el mundo de hoy
 * el que espera no se puede correr solo en x —`paso()` rehace `vx` desde el mando en cada
 * subpaso, y una vuelta a la entrada cambia los dos ejes—, así que ninguna traza lo haría caer
 * por x solo. Con las cajas y las compuertas de `T-272` tampoco, y no por suerte: ninguna pieza
 * tiene fuerza (`CTR-16.10`, reglas 2 y 3). Una caja frena contra un cuerpo y espera; una
 * compuerta no se cierra sobre nadie. La comparación de los dos ejes queda igual, por si algún
 * día entra una pieza que sí la tenga.
 */
export function seMovio(antesX: number, antesY: number, despues: { readonly x: number; readonly y: number }): boolean {
  return despues.x !== antesX || despues.y !== antesY;
}

/**
 * **La regla de repetición de `CTR-18.5`**, la misma en el test, en el solucionador y en el
 * script:
 *
 * 1. el banco es el que llega, entero, con su leyenda de verdad;
 * 2. `crearMundo(banco, nivel)`, y nada más prepara el mundo;
 * 3. la traza se expande a un mando por cuadro —la columna que no figura va `QUIETO`—;
 * 4. un `paso(mundo, mando, CUADRO_SEG)` por cuadro, y nada más toca el mundo entre uno y otro;
 * 5. gana si `terminado` se vuelve `true` **exactamente en el último cuadro**: antes, sobran
 *    cuadros; nunca, no gana. Las dos cosas las dice `exigirTraza()`.
 *
 * Y de paso cuenta lo que las reglas 6, 7, 9 y 11 miran: las vueltas, el que espera, la paridad y
 * las cajas.
 */
export function repetir(banco: Banco, nivel: Nivel, traza: Traza): Repeticion {
  const mundo = crearMundo(banco, nivel);
  // Los tramos son las compuertas del mundo: el mismo `id`, la misma columna, las mismas filas.
  const tramos: readonly TramoDeCompuerta[] = mundo.compuertas;
  const paridad = nuevaCuentaDeParidad(tramos);
  const vueltas = porPersonaje();
  const vueltasSinDedo = porPersonaje();
  const saltos = porPersonaje();
  const tesoros = porPersonaje();
  let primeraVuelta: Repeticion['primeraVuelta'] = null;
  let primerMovimiento: Repeticion['primerMovimientoDelQueEspera'] = null;
  let primeraEspera: Repeticion['primeraEspera'] = null;
  let primerCambioConCajaAndando: Repeticion['primerCambioConCajaAndando'] = null;
  let primerCuadroConDos: number | null = null;
  let movimientos = 0;
  let cuadrosConCajaEnEspera = 0;
  let cambiosConCajaAndando = 0;
  let puerta = 0;
  let maxColumnas = 0;
  let cambios = 0;
  let cambiosSinPiso = 0;
  let ultima: IdPersonaje | null = null;
  let jugados = 0;
  let total = 0;

  for (const corrida of traza) {
    const m = corrida.mandos;
    const columnas = columnasConTeclas(m);
    const espera = queEspera(m);
    for (let i = 0; i < corrida.cuadros; i++) {
      total++;
      if (mundo.terminado) continue;
      maxColumnas = Math.max(maxColumnas, columnas.length);
      if (columnas.length === 1) {
        const columna = columnas[0];
        if (ultima !== null && columna !== ultima) {
          cambios++;
          // Se mira el estado de antes del cuadro: es el que tenía el que se queda esperando.
          if (!PERSONAJES.every((id) => enElPiso(mundo.cuerpos[id]))) cambiosSinPiso++;
          // Y la sala: si una caja todavía anda, el mundo cambia mientras el pulgar viaja (regla 11).
          const andando = mundo.cajas.find((k) => k.estado !== 'quieta');
          if (andando !== undefined) {
            cambiosConCajaAndando++;
            primerCambioConCajaAndando ??= { cuadro: jugados, quien: columna, empujadaPor: andando.empujadaPor };
          }
        }
        ultima = columna;
      } else if (columnas.length === 2) {
        primerCuadroConDos ??= jugados;
        ultima = null;
      }
      // Las posiciones de antes del cuadro: las del que espera siempre (regla 7), y las de los dos
      // solo si hay compuertas que contar. Esto corre en cada cuadro de cada candidata del
      // solucionador, así que no se aloca lo que no se va a mirar.
      const antesX = espera === null ? 0 : mundo.cuerpos[espera].x;
      const antesY = espera === null ? 0 : mundo.cuerpos[espera].y;
      const antes = tramos.length > 0 ? posiciones(mundo) : null;
      const sucesos = paso(mundo, m, CUADRO_SEG);
      const espero = mundo.cajas.find((k) => k.espera !== null)?.espera ?? null;
      if (espero !== null) {
        cuadrosConCajaEnEspera++;
        primeraEspera ??= { cuadro: jugados, ...espero };
      }
      for (const s of sucesos) {
        if (s.tipo === 'vuelta') {
          vueltas[s.quien]++;
          const conDedo = tieneTeclas(m[s.quien]);
          if (!conDedo) vueltasSinDedo[s.quien]++;
          primeraVuelta ??= { cuadro: jugados, quien: s.quien, conDedo };
        } else if (s.tipo === 'salto') saltos[s.quien]++;
        else if (s.tipo === 'tesoro') tesoros[s.quien]++;
        else if (s.tipo === 'puerta') puerta++;
      }
      if (antes !== null) paridad.cuadro(sucesos, antes, posiciones(mundo));
      if (espera !== null) {
        const c = mundo.cuerpos[espera];
        if (seMovio(antesX, antesY, c)) {
          movimientos++;
          primerMovimiento ??= { cuadro: jugados, quien: espera, desde: { x: antesX, y: antesY }, hasta: { x: c.x, y: c.y } };
        }
      }
      jugados++;
    }
  }

  return {
    gana: mundo.terminado,
    cuadros: jugados,
    sobrantes: total - jugados,
    segundos: mundo.tiempo,
    vueltas,
    vueltasSinDedo,
    primeraVuelta,
    maxColumnasConTeclas: maxColumnas,
    primerCuadroConDos,
    cambiosDeColumna: cambios,
    cambiosSinPiso,
    movimientosDelQueEspera: movimientos,
    primerMovimientoDelQueEspera: primerMovimiento,
    cuadrosConCajaEnEspera,
    primeraEspera,
    cambiosConCajaAndando,
    primerCambioConCajaAndando,
    sucesos: { saltos, tesoros, puerta },
    paridad: paridad.paridad(),
    final: {
      skayboy: { x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y, enPuerta: mundo.cuerpos.skayboy.enPuerta },
      poligirl: { x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y, enPuerta: mundo.cuerpos.poligirl.enPuerta },
    },
  };
}

/** `uno`: una persona sola, una columna por vez. `dos`: dos personas, las dos a la vez. */
export type Modo = 'uno' | 'dos';

/**
 * El comando que regraba la traza de un nivel (`ADR-09.4`). **Todo mensaje de las reglas 5 a 8
 * de `CTR-18.6` termina con esto**: el test cae nombrando el nivel, y el que lo lee tiene en la
 * misma línea lo que hay que correr.
 */
export function comandoParaRegrabar(id: string): string {
  return `node scripts/resolver-niveles.mjs --regrabar ${id}`;
}

const punto = (p: { readonly x: number; readonly y: number }): string =>
  `(${Math.round(p.x * 10) / 10}, ${Math.round(p.y * 10) / 10})`;

const enCuadros = (n: number): string => `${n} cuadro${n === 1 ? '' : 's'}`;

/**
 * Lo que la repetición rompe de las reglas 5 a 7 de `CTR-18.6`, sin el nivel. Vacío es sano.
 *
 * - **5, gana y en el último cuadro** (`CTR-18.5`): ni uno de menos ni uno de más.
 * - **6, nadie vuelve a la entrada**, ni el que espera ni el que juega: un "así se hace" que pasa
 *   por perder no es uno. Si el que vuelve no tenía dedo encima, el mensaje lo dice: es `BR-25` (d).
 * - **7, el que espera no se mueve**, y en la de uno **nunca dos columnas en un cuadro**
 *   (`BR-25` b y c) ni un cambio de columna con alguno en el aire.
 * - **11, las cajas no corren carreras** (`CTR-16.10.5`, `CTR-16.10.11`): en ningún cuadro una caja
 *   espera a un cuerpo, y al agarrar la otra columna ninguna caja anda. Solo en la de uno, que es
 *   la única que se graba (`CTR-18.4`).
 */
export function problemasDeLaRepeticion(r: Repeticion, largo: number, modo: Modo): string[] {
  const problemas: string[] = [];
  if (!r.gana) {
    const donde = PERSONAJES.map((id) =>
      r.final[id].enPuerta ? `${id} en su puerta` : `${id} está en ${punto(r.final[id])}`,
    );
    problemas.push(`no gana: después de sus ${enCuadros(r.cuadros)}, ${donde.join(' y ')}`);
  } else if (r.sobrantes > 0) {
    problemas.push(`gana a los ${enCuadros(r.cuadros)} y la traza tiene ${largo}: ${r.sobrantes === 1 ? 'sobra 1' : `sobran ${r.sobrantes}`}`);
  }
  const v = r.primeraVuelta;
  if (v !== null) {
    const total = r.vueltas.skayboy + r.vueltas.poligirl;
    problemas.push(
      `cuadro ${v.cuadro}: ${v.quien} volvió a la entrada` +
        (v.conDedo ? '' : ' y su columna estaba suelta (BR-25 d)') +
        (total > 1 ? `, y hay ${total - 1} vuelta(s) más` : ''),
    );
  }
  if (modo === 'uno') {
    if (r.primerCuadroConDos !== null) {
      problemas.push(`cuadro ${r.primerCuadroConDos}: las dos columnas tienen teclas, y una persona sola no las toca a la vez (BR-25 b y c)`);
    }
    const m = r.primerMovimientoDelQueEspera;
    if (m !== null) {
      problemas.push(`cuadro ${m.cuadro}: ${m.quien} esperaba y se movió de ${punto(m.desde)} a ${punto(m.hasta)}`);
    }
    if (r.cambiosSinPiso > 0) {
      problemas.push(`${r.cambiosSinPiso} cambio(s) de columna con alguno en el aire: el que espera no queda a salvo (BR-25 d)`);
    }
    const e = r.primeraEspera;
    if (e !== null) {
      const donde = e.donde === 'arriba' ? 'arriba de' : e.donde === 'contra' ? 'contra' : 'debajo de';
      problemas.push(
        `cuadro ${e.cuadro}: una caja espera ${donde} ${e.quien}` +
          (r.cuadrosConCajaEnEspera > 1 ? ` (y espera en ${r.cuadrosConCajaEnEspera - 1} cuadro(s) más)` : '') +
          ': es una carrera, y la traza de uno no pasa por ninguna (CTR-16.10.5)',
      );
    }
    const a = r.primerCambioConCajaAndando;
    if (a !== null) {
      const de = a.empujadaPor === null ? 'que empujaron los dos' : `que empujó ${a.empujadaPor}`;
      problemas.push(`cuadro ${a.cuadro}: ${a.quien} agarra su columna y la caja ${de} todavía anda (CTR-16.10.11)`);
    }
  }
  return problemas;
}

/**
 * Repite la traza y **tira** si no cumple las reglas 5 a 7 de `CTR-18.6`, con el nivel adelante
 * y —en la de uno, que es la que se graba— el comando que la regraba al final. Es la guarda que
 * `soluciones.test.ts` corre sobre cada traza grabada, y la que el solucionador corre sobre las
 * suyas antes de devolverlas.
 */
export function exigirTraza(banco: Banco, nivel: Nivel, traza: Traza, modo: Modo = 'uno'): Repeticion {
  const r = repetir(banco, nivel, traza);
  const problemas = problemasDeLaRepeticion(r, largoDe(traza), modo);
  if (problemas.length > 0) {
    throw new Error(
      modo === 'uno'
        ? `${nivel.id} · ${problemas.join(' · ')}. Para regrabarla: ${comandoParaRegrabar(nivel.id)}`
        : `${nivel.id}, la de a dos · ${problemas.join(' · ')}`,
    );
  }
  return r;
}

/* =========================================================================================
   4. La paridad (CTR-18.8)
   ========================================================================================= */

/**
 * El suceso de `CTR-16.10.7`, tal como lo emite `mundo.ts` desde `T-272`: la compuerta `id` se
 * abrió o se cerró de verdad, y `por` es a quién se le atribuye el cambio, o `null` si no fue uno
 * solo.
 */
export type SucesoDeCompuerta = Extract<Suceso, { readonly tipo: 'compuerta' }>;

/** Lo que la cuenta lee de un cuadro: los sucesos del mundo, que desde `T-272` traen la compuerta. */
export type SucesoLeido = Suceso;

/** El tramo de una compuerta, leído de la grilla. Vive en `niveles.ts`; se reexporta para la cuenta. */
export type { TramoDeCompuerta };

/** Quién le abrió paso a quién (`BR-23` punto 1). */
export interface Paridad {
  readonly skayboyAPoligirl: number;
  readonly poligirlASkayboy: number;
}

export type Posiciones = Readonly<Record<IdPersonaje, { readonly x: number; readonly y: number }>>;

/**
 * Los tramos de compuerta del nivel, leídos de la grilla, con su `id` de `compuertas`. **Es la
 * misma función que arma las compuertas del mundo y que corre `E2`**: vive en `niveles.ts`, y se
 * reexporta acá para que la cuenta y su prueba la nombren desde donde la usan. Una sola lectura
 * de la grilla, tres usos.
 */
export { tramosDeCompuertas };

export interface CuentaDeParidad {
  /** Lo que pasó en un cuadro: sus sucesos, y dónde estaba cada cuerpo al empezarlo y al terminarlo. */
  cuadro(sucesos: readonly SucesoLeido[], antes: Posiciones, despues: Posiciones): void;
  paridad(): Paridad;
}

/**
 * **La cuenta de `CTR-18.8`**, cuadro a cuadro. Consume tres cosas:
 *
 * - **la apertura**: un suceso `compuerta` con `abierta: true`, que trae a quién se le atribuye
 *   (`por`, `CTR-16.10.7`: el que cruzó la palanca, el que pisó la placa, o el `empujadaPor` de
 *   la caja que la pisa);
 * - **el cierre**: el mismo suceso con `abierta: false`, que termina la apertura traiga el `por`
 *   que traiga;
 * - **el cruce**, que no es un suceso del mundo: lo lee esta cuenta comparando cada cuerpo al
 *   empezar y al terminar el cuadro. Cruza el que tiene el centro de su caja de colisión de un
 *   lado y después del otro del centro de la columna del tramo, **tocando alguna fila del
 *   tramo** —el que camina por arriba del sólido que corona una compuerta no la cruzó—.
 *
 * La regla, citada: *un cuerpo B cruza una compuerta mientras sigue abierta una apertura con
 * `por: A`, y A no es B: suma uno a "A le abrió paso a B"*. **Cada apertura suma a lo sumo uno**,
 * aunque B cruce tres veces antes del cierre. No suman la apertura propia, la de `por: null`, ni
 * nada que no sea una compuerta.
 *
 * Dos detalles de la lectura, y por qué: el lado de cada cuerpo se recuerda entre cuadros, así
 * que un centro que queda justo sobre el de la columna al final de un cuadro no pierde el cruce;
 * y **una vuelta a la entrada no es un cruce** —cambia de lugar de una, no recorre nada
 * (`CTR-16.10.2`)—: el lado se actualiza sin sumar. Dentro de un cuadro, primero cuentan las
 * aperturas, después los cruces y después los cierres; `CTR-18.8` explica por qué el orden no
 * puede decidir nada (hay trece píxeles nativos entre apoyarse contra la compuerta y tener el
 * centro sobre su columna).
 */
export function nuevaCuentaDeParidad(tramos: readonly TramoDeCompuerta[]): CuentaDeParidad {
  const abiertas = new Map<string, { readonly por: IdPersonaje | null; sumo: boolean }>();
  const lado = new Map<string, -1 | 1>();
  let skayboyAPoligirl = 0;
  let poligirlASkayboy = 0;

  const ladoDe = (x: number, t: TramoDeCompuerta): -1 | 0 | 1 => {
    const centro = x + CUERPO_ANCHO / 2;
    const columna = t.columna * TILE + TILE / 2;
    return centro < columna ? -1 : centro > columna ? 1 : 0;
  };
  const tocaElTramo = (y: number, t: TramoDeCompuerta): boolean =>
    y < (t.hastaFila + 1) * TILE && y + CUERPO_ALTO > t.desdeFila * TILE;

  return {
    cuadro(sucesos, antes, despues) {
      // Sin compuertas no hay nada que contar, y esto corre en cada cuadro de cada repetición
      // del solucionador: no se aloca nada.
      if (tramos.length === 0) return;
      const durante = new Map(abiertas);
      const volvieron = new Set<IdPersonaje>();
      const cierres: string[] = [];
      for (const s of sucesos) {
        if (s.tipo === 'vuelta') volvieron.add(s.quien);
        if (s.tipo !== 'compuerta') continue;
        if (s.abierta) {
          const apertura = { por: s.por, sumo: false };
          abiertas.set(s.id, apertura);
          durante.set(s.id, apertura);
        } else {
          cierres.push(s.id);
        }
      }
      for (const quien of PERSONAJES) {
        for (const t of tramos) {
          const clave = `${quien}|${t.id}`;
          const ahora = ladoDe(despues[quien].x, t);
          const recordado = lado.get(clave) ?? ladoDe(antes[quien].x, t);
          if (ahora === 0) continue;
          lado.set(clave, ahora);
          if (recordado === 0 || recordado === ahora || volvieron.has(quien)) continue;
          if (!tocaElTramo(antes[quien].y, t) && !tocaElTramo(despues[quien].y, t)) continue;
          const apertura = durante.get(t.id);
          if (apertura === undefined || apertura.por === null || apertura.por === quien || apertura.sumo) continue;
          apertura.sumo = true;
          if (apertura.por === 'skayboy') skayboyAPoligirl++;
          else poligirlASkayboy++;
        }
      }
      for (const id of cierres) abiertas.delete(id);
    },
    paridad: () => ({ skayboyAPoligirl, poligirlASkayboy }),
  };
}

/** Suma los pares de varios niveles: la paridad se cuenta sobre el banco (`BR-23` punto 1). */
export function sumarParidad(pares: readonly Paridad[]): Paridad {
  return pares.reduce(
    (a, p) => ({
      skayboyAPoligirl: a.skayboyAPoligirl + p.skayboyAPoligirl,
      poligirlASkayboy: a.poligirlASkayboy + p.poligirlASkayboy,
    }),
    { skayboyAPoligirl: 0, poligirlASkayboy: 0 },
  );
}

/**
 * La diferencia máxima entre las dos cuentas, **sobre los seis niveles**. Es el número de
 * `BR-23` punto 1, citado: no es de este contrato ni de este módulo.
 */
export const DIFERENCIA_MAXIMA_DE_PARIDAD = 1; // BR-23 punto 1: "diferencia máxima de uno, contada sobre los seis niveles"

const veces = (n: number): string => `${n} ${n === 1 ? 'vez' : 'veces'}`;

/** La regla 9 de `CTR-18.6` sobre la suma del banco. `null` es sana. */
export function problemaDeParidad(total: Paridad): string | null {
  const diferencia = Math.abs(total.skayboyAPoligirl - total.poligirlASkayboy);
  if (diferencia <= DIFERENCIA_MAXIMA_DE_PARIDAD) return null;
  return (
    `paridad: Poligirl le abre paso a Skayboy ${veces(total.poligirlASkayboy)} y Skayboy a Poligirl ` +
    `${veces(total.skayboyAPoligirl)}; BR-23.1 pide diferencia ≤ ${DIFERENCIA_MAXIMA_DE_PARIDAD}`
  );
}

/* =========================================================================================
   5. La foto del mundo
   ========================================================================================= */

/**
 * Una copia del mundo para seguir jugando sin tocar el original. **El banco y el nivel se
 * comparten** —no cambian nunca—, **los cuerpos y los tesoros se copian**.
 *
 * La usan la tolerancia, que repite cada variante desde la foto del cuadro donde empieza a
 * cambiar en vez de desde el cuadro cero, y la búsqueda del solucionador. Es la palanca que
 * `CTR-18.7` reservaba para cuando el test se pasara de su presupuesto, y la condición que le
 * ponía es **su propio caso de prueba: foto más resto es la corrida entera**. Está en
 * `soluciones.test.ts`, sobre cada traza grabada.
 *
 * Desde `T-272` el mundo tiene también las piezas de la sala —palancas, placas, compuertas y
 * cajas—, y se copian una por una: si dos variantes compartieran una compuerta, abrirla en una la
 * abriría en la otra. El tipo lo exige —este literal no compila si a `Mundo` le falta un campo— y
 * la prueba lo mira al correr, sobre una sala con las cuatro piezas.
 */
export function clonarMundo(m: Mundo): Mundo {
  return {
    banco: m.banco,
    nivel: m.nivel,
    cuerpos: { skayboy: { ...m.cuerpos.skayboy }, poligirl: { ...m.cuerpos.poligirl } },
    juntados: new Set(m.juntados),
    palancas: m.palancas.map((p) => ({ ...p })),
    placas: m.placas.map((l) => ({ ...l })),
    compuertas: m.compuertas.map((g) => ({ ...g })),
    cajas: m.cajas.map(clonarCaja),
    tiempo: m.tiempo,
    terminado: m.terminado,
  };
}

function clonarCaja(k: Caja): Caja {
  return { ...k, espera: k.espera === null ? null : { ...k.espera } };
}

/**
 * **Lo que la sala tiene de mutable** fuera de los cuerpos y los tesoros, en una línea: cada
 * palanca (activa o no), cada placa (pisada o no), cada compuerta **en su estado real** —no el
 * mandato: puede estar abierta esperando que alguien salga— y cada caja con su lugar, su
 * movimiento y quién la empujó.
 *
 * La usan dos: la búsqueda del solucionador, para saber cuándo un turno cambió algo del mundo; y
 * `mismoFuturo()`, que decide cuándo una variante de la tolerancia volvió **exactamente** al
 * camino de la original. Por eso va **sin redondear**: agrupar estados parecidos para buscar es
 * cosa de la clave del solucionador (`claveDeEstado()`), no de esta. Lo único que no entra es la
 * `espera` de una caja, que dice qué pasó en el último cuadro y no decide nada de lo que sigue.
 * Una pieza que falte acá es una pieza que ni la búsqueda ni la tolerancia ven.
 */
export function claveDeMecanismos(mundo: Mundo): string {
  if (mundo.palancas.length + mundo.placas.length + mundo.compuertas.length + mundo.cajas.length === 0) return '';
  const partes: string[] = [];
  for (const p of mundo.palancas) partes.push(`${p.id}:${p.activa ? 'activa' : 'reposo'}`);
  for (const l of mundo.placas) partes.push(`${l.id}:${l.pisada ? 'pisada' : 'libre'}`);
  for (const g of mundo.compuertas) partes.push(`${g.id}:${g.abierta ? 'abierta' : 'cerrada'}`);
  mundo.cajas.forEach((k, i) =>
    partes.push(`caja${i}:${k.x},${k.y},${k.estado},${k.direccion},${k.vy},${k.columna},${k.fila},${k.empujadaPor ?? '-'}`),
  );
  return partes.join('|');
}

/**
 * Si desde estos dos mundos, con los mismos mandos, pasa exactamente lo mismo: los cuerpos sin
 * redondear y los mecanismos. Los tesoros no entran porque no deciden si se gana; `vx`, `mira`,
 * `conDedo` y `enPuerta` tampoco, porque `paso()` los vuelve a calcular antes de usarlos.
 *
 * Se exporta para su prueba y para nada más: en una partida de verdad los campos de un cuerpo se
 * mueven juntos —un salto corrido cambia la altura y la velocidad vertical a la vez—, así que
 * sacar una sola comparación de acá no cambia ninguna tolerancia medida, ni en `NIV-01` ni en el
 * hueco que salta. `soluciones.test.ts` la prueba campo por campo (`T-267`).
 */
export function mismoFuturo(a: Mundo, b: Mundo): boolean {
  if (a.terminado !== b.terminado) return false;
  for (const id of PERSONAJES) {
    const p = a.cuerpos[id];
    const q = b.cuerpos[id];
    if (
      p.x !== q.x ||
      p.y !== q.y ||
      p.vy !== q.vy ||
      p.enSuelo !== q.enSuelo ||
      p.desdeElSuelo !== q.desdeElSuelo ||
      p.saltoGuardado !== q.saltoGuardado ||
      p.saltoApretado !== q.saltoApretado ||
      p.yaSalto !== q.yaSalto
    ) {
      return false;
    }
  }
  return claveDeMecanismos(a) === claveDeMecanismos(b);
}

/* =========================================================================================
   6. La tolerancia (ADR-09.5, CTR-18.7)
   ========================================================================================= */

/**
 * Hasta dónde se **mide** la tolerancia, en cuadros: un segundo (`ADR-09.5`). Si un borde
 * llega, el script imprime `≥ 60`.
 */
export const TOPE_TOLERANCIA = 60;

/**
 * **El mínimo de `BR-29` punto 3, por escalón, en cuadros.** Vive acá y no en el test porque lo
 * usan dos: el test (regla 8 de `CTR-18.6`) y el script, que `T-277` corre para ver "tolerancia
 * ≥ la de `BR-29` en cada escalón". Dos copias del número son dos números (`CTR-18.11`).
 */
export const TOLERANCIA_MINIMA_CUADROS: Readonly<Record<number, number>> = {
  1: 10, // BR-29 punto 3: Fácil (niveles 1 y 2), ≥ 10 cuadros, 0,167 s a 60 cuadros por segundo
  2: 6, // BR-29 punto 3: Media (niveles 3 y 4), ≥ 6 cuadros, 0,10 s
  3: 4, // BR-29 punto 3: Difícil (niveles 5 y 6), ≥ 4 cuadros, 0,067 s
};

/**
 * El piso técnico de `ADR-09.1`, en cuadros: las teclas se leen una vez por tic, y un teléfono
 * que dibuja a veinte tics por segundo corre tres cuadros con el mismo mando. Con menos de esto
 * en un escalón, ese teléfono juega un nivel distinto del que probó la máquina.
 */
export const PISO_TECNICO_CUADROS = 2;

/** El mínimo de `BR-29` para ese escalón. Tira si el escalón no tiene uno: el schema los limita a 1, 2 y 3. */
export function toleranciaMinima(escalon: number): number {
  const minimo = TOLERANCIA_MINIMA_CUADROS[escalon];
  if (minimo === undefined) throw new Error(`BR-29 no fija tolerancia para el escalón ${escalon}`);
  return minimo;
}

export interface Borde {
  readonly columna: IdPersonaje;
  readonly tecla: Tecla;
  /** Desde este cuadro, la tecla está apretada (o suelta). */
  readonly cuadro: number;
  readonly sentido: 'aprieta' | 'suelta';
  /** El n-ésimo borde de esa tecla, contando desde cero: lo reconoce aunque la traza se estire. */
  readonly orden: number;
  /** Cuántos cuadros se lo puede correr hacia antes, y hacia después, sin dejar de ganar. */
  readonly antes: number;
  readonly despues: number;
  readonly tolerancia: number;
}

export interface Tolerancia {
  /** La del nivel: el mínimo sobre sus bordes. `tope` si la traza no tiene ninguno. */
  readonly minimo: number;
  readonly tope: number;
  readonly bordes: readonly Borde[];
  /** El de menor tolerancia; si empatan, el que llega primero. */
  readonly masApretado: Borde | null;
}

/** Los cuadros donde la señal cambia. Antes del cuadro cero, toda tecla está suelta (`CTR-18.7` punto 1). */
function bordesDeLaSenal(senal: readonly boolean[]): number[] {
  const bordes: number[] = [];
  let valor = false;
  senal.forEach((v, t) => {
    if (v !== valor) {
      bordes.push(t);
      valor = v;
    }
  });
  return bordes;
}

/** El mando del cuadro con una sola tecla de una sola columna cambiada. */
export function conTecla(m: Mandos, columna: IdPersonaje, tecla: Tecla, valor: boolean): Mandos {
  const cambiado: Mando = { ...m[columna], [tecla]: valor };
  return columna === 'skayboy' ? { skayboy: cambiado, poligirl: m.poligirl } : { skayboy: m.skayboy, poligirl: cambiado };
}

/**
 * El tramo que cambia cuando el borde del cuadro `t` se corre `delta` cuadros, y el valor que
 * toma la tecla ahí (`CTR-18.7` puntos 2 y 3): **más tarde**, los cuadros de `t` a
 * `t + delta − 1` toman el valor de antes del borde; **más temprano**, los de `t + delta` a
 * `t − 1` toman el de después, y nada va antes del cuadro cero —apretar antes de que empiece
 * la partida es tenerla apretada desde el principio—. `null` si no cambia nada.
 *
 * **Si el tramo pisa otro borde de la misma tecla, lo pisa**: el gesto se acorta o desaparece,
 * y la física dice si todavía gana. No se topea ni se arrastra nada a mano. La consecuencia que
 * hay que saber: **un toque de saltar de un cuadro, demorado un cuadro, desaparece**, así que su
 * tolerancia es cero. La traza grabada no salta con toques de un cuadro: el solucionador
 * sostiene la tecla, y sostenerla no cambia nada en `mundo.ts` (salta con el flanco) salvo que
 * ahora un pulgar tardío todavía salta.
 */
export function tramoCorrido(
  cuadros: readonly Mandos[],
  columna: IdPersonaje,
  tecla: Tecla,
  t: number,
  delta: number,
): { readonly desde: number; readonly hasta: number; readonly valor: boolean } | null {
  const antesDelBorde = t > 0 ? cuadros[t - 1][columna][tecla] : false;
  const despuesDelBorde = cuadros[t][columna][tecla];
  const tramo =
    delta > 0
      ? { desde: t, hasta: t + delta, valor: antesDelBorde }
      : { desde: Math.max(0, t + delta), hasta: t, valor: despuesDelBorde };
  return tramo.desde < tramo.hasta ? tramo : null;
}

/**
 * Si la variante —la traza con ese único borde corrido— **gana sin que nadie vuelva a la
 * entrada** (`CTR-18.7` punto 4).
 *
 * Se juega estirada a `L + |delta|` cuadros repitiendo el último (punto 2): un apriete demorado
 * llega más tarde, y llegar más tarde no es no llegar. A la variante no se le pide el último
 * cuadro exacto, ni una columna por cuadro, ni que el que espera no se mueva: no es una traza
 * nueva, es la misma partida jugada con un pulgar peor.
 *
 * Arranca de la foto de la original en el primer cuadro que cambia —lo de antes es idéntico— y,
 * con `atajo`, **se corta apenas vuelve exactamente al estado de la original** en el mismo
 * cuadro (`mismoFuturo()`): de ahí en adelante los mandos son los mismos, así que el final
 * también. El atajo solo se toma si la original no tiene vueltas. Que no cambia ningún número lo
 * prueba `soluciones.test.ts`, midiendo las trazas grabadas con y sin él.
 */
function ganaConElBordeCorrido(
  cuadros: readonly Mandos[],
  fotos: readonly Mundo[],
  atajo: boolean,
  columna: IdPersonaje,
  tecla: Tecla,
  t: number,
  delta: number,
): boolean {
  const tramo = tramoCorrido(cuadros, columna, tecla, t, delta);
  if (tramo === null) return true;
  const largo = cuadros.length;
  const mundo = clonarMundo(fotos[tramo.desde]);
  for (let f = tramo.desde; f < largo + Math.abs(delta); f++) {
    const original = cuadros[Math.min(f, largo - 1)];
    const corrido = f < tramo.hasta && original[columna][tecla] !== tramo.valor;
    const sucesos = paso(mundo, corrido ? conTecla(original, columna, tecla, tramo.valor) : original, CUADRO_SEG);
    if (sucesos.some((s) => s.tipo === 'vuelta')) return false;
    if (mundo.terminado) return true;
    if (atajo && f + 1 >= tramo.hasta && f + 1 < largo && mismoFuturo(mundo, fotos[f + 1])) return true;
  }
  return false;
}

/** Cómo se reconoce un borde entre dos mediciones de la misma traza, aunque se haya estirado. */
export const idDeBorde = (b: Pick<Borde, 'columna' | 'tecla' | 'orden'>): string => `${b.columna}/${b.tecla}/${b.orden}`;

export interface OpcionesDeMedicion {
  /** Hasta dónde se mide cada borde, en cuadros. Por defecto `TOPE_TOLERANCIA`. */
  readonly tope?: number;
  /**
   * Con piso, **abandona apenas un borde aguanta menos** y devuelve `null`: es lo que usa el
   * ensanchado del solucionador, que solo quiere saber si una candidata mejora.
   */
  readonly piso?: number;
  /** Los bordes que se miden primero, por su `idDeBorde()`: para que el corte del piso llegue temprano. */
  readonly primero?: readonly string[];
  /** `false` apaga el atajo de `mismoFuturo()`. Existe para que la prueba vea que no cambia nada. */
  readonly atajo?: boolean;
}

/**
 * **La tolerancia, hecha operación** (`CTR-18.7`), con la definición de `ADR-09.5` y `BR-29`,
 * textual:
 *
 * > para cada borde de la traza —el cuadro donde una tecla se aprieta o se suelta—, el mayor d
 * > tal que correr ese borde cualquier cantidad de cuadros entre 1 y d, antes o después,
 * > dejando todo lo demás igual, sigue ganando. La tolerancia del nivel es el mínimo sobre sus
 * > bordes.
 *
 * Cada tecla de cada personaje es una línea de cuadros y un borde es donde cambia, así que un
 * cambio de columna sin pausa son varios bordes en el mismo cuadro y **cada uno se corre
 * solo**; el corrimiento es `tramoCorrido()`, que pisa lo que encuentra; y "sigue ganando" es
 * `ganaConElBordeCorrido()`. Tira si la traza misma no gana: no hay tolerancia que medir.
 */
export function medirTolerancia(banco: Banco, nivel: Nivel, traza: Traza, opciones: OpcionesDeMedicion = {}): Tolerancia | null {
  const tope = opciones.tope ?? TOPE_TOLERANCIA;
  const piso = opciones.piso ?? -Infinity;
  const cuadros = expandir(traza);
  const fotos: Mundo[] = [];
  const mundo = crearMundo(banco, nivel);
  let sinVueltas = true;
  for (const m of cuadros) {
    fotos.push(clonarMundo(mundo));
    if (paso(mundo, m, CUADRO_SEG).some((s) => s.tipo === 'vuelta')) sinVueltas = false;
  }
  if (!mundo.terminado) throw new Error(`${nivel.id}: la traza no gana, así que no hay tolerancia que medir`);
  const atajo = sinVueltas && opciones.atajo !== false;

  const pendientes: { columna: IdPersonaje; tecla: Tecla; cuadro: number; orden: number }[] = [];
  for (const columna of PERSONAJES) {
    for (const tecla of TECLAS) {
      bordesDeLaSenal(cuadros.map((m) => m[columna][tecla])).forEach((cuadro, orden) =>
        pendientes.push({ columna, tecla, cuadro, orden }),
      );
    }
  }
  const rango = new Map((opciones.primero ?? []).map((id, k) => [id, k]));
  pendientes.sort((a, b) => (rango.get(idDeBorde(a)) ?? Infinity) - (rango.get(idDeBorde(b)) ?? Infinity));

  const bordes: Borde[] = [];
  for (const { columna, tecla, cuadro, orden } of pendientes) {
    const aguanta = (hacia: -1 | 1): number => {
      for (let d = 1; d <= tope; d++) {
        if (!ganaConElBordeCorrido(cuadros, fotos, atajo, columna, tecla, cuadro, hacia * d)) return d - 1;
      }
      return tope;
    };
    const antesDe = aguanta(-1);
    if (antesDe < piso) return null;
    const despues = aguanta(1);
    if (despues < piso) return null;
    bordes.push({
      columna,
      tecla,
      cuadro,
      sentido: orden % 2 === 0 ? 'aprieta' : 'suelta',
      orden,
      antes: antesDe,
      despues,
      tolerancia: Math.min(antesDe, despues),
    });
  }
  bordes.sort(
    (a, b) =>
      a.cuadro - b.cuadro ||
      PERSONAJES.indexOf(a.columna) - PERSONAJES.indexOf(b.columna) ||
      TECLAS.indexOf(a.tecla) - TECLAS.indexOf(b.tecla),
  );
  let masApretado: Borde | null = null;
  for (const b of bordes) if (masApretado === null || b.tolerancia < masApretado.tolerancia) masApretado = b;
  return { minimo: masApretado?.tolerancia ?? tope, tope, bordes, masApretado };
}

/**
 * La tolerancia de la traza hasta `tope` (por defecto un segundo, `ADR-09.5`). Es la medición
 * entera, sin piso: la que imprime el script y la que usa la regla 8 con el mínimo de `BR-29`
 * como tope.
 *
 * Un aviso para el que lea los números: una traza **mínima** no aguanta casi nada, porque suelta
 * cada tecla en el último cuadro que todavía sirve. Por eso lo que se graba es una traza
 * ensanchada, y lo que mide esto es cuánto aguanta **esa**.
 */
export function tolerancia(
  banco: Banco,
  nivel: Nivel,
  traza: Traza,
  opciones: Pick<OpcionesDeMedicion, 'tope' | 'atajo'> = {},
): Tolerancia {
  const medida = medirTolerancia(banco, nivel, traza, opciones);
  if (medida === null) throw new Error('medirTolerancia() sin piso siempre mide');
  return medida;
}

/**
 * **La regla 8 de `CTR-18.6`**: la tolerancia alcanza el mínimo de `BR-29` para el escalón del
 * nivel. **Verifica, no calcula** (`ADR-09.5`): mide cada borde hasta ese mínimo y nada más,
 * porque el máximo exacto cuesta varias veces más y no decide nada. Devuelve el mensaje en
 * rojo, o `null`.
 */
export function problemaDeTolerancia(banco: Banco, nivel: Nivel, traza: Traza): string | null {
  const minimo = toleranciaMinima(nivel.escalon);
  const t = tolerancia(banco, nivel, traza, { tope: minimo });
  const b = t.masApretado;
  if (t.minimo >= minimo || b === null) return null;
  return (
    `${nivel.id} (escalón ${nivel.escalon}) · el borde del cuadro ${b.cuadro} (${b.columna}, ${b.tecla}, ${b.sentido}) ` +
    `aguanta ${enCuadros(b.tolerancia)} y BR-29 pide ${minimo}. Para regrabarla: ${comandoParaRegrabar(nivel.id)}`
  );
}

/* =========================================================================================
   7. El archivo entero: las reglas que miran más de una traza
   ========================================================================================= */

/** La regla 1 de `CTR-18.6`: cada nivel del banco tiene su traza, y cada traza su nivel. */
export function problemasDeCorrespondencia(niveles: readonly string[], conTraza: readonly string[]): string[] {
  return [
    ...niveles
      .filter((id) => !conTraza.includes(id))
      .map((id) => `${id} no tiene traza. Para grabarla: ${comandoParaRegrabar(id)}`),
    ...conTraza.filter((id) => !niveles.includes(id)).map((id) => `hay traza para ${id} y no hay ${id}`),
  ];
}

/**
 * La regla 2: las trazas están en la unidad del mundo. `cuadrosPorSegundo` no es un derivado
 * (`CTR-18.2`): es la unidad en que se grabaron, y si `mundo.ts` cambia el cuadro, todas quedan
 * en otra unidad a la vez. Mejor una línea que lo diga que seis niveles rojos que no explican.
 */
export function problemaDeUnidad(cuadrosPorSegundo: number): string | null {
  const delMundo = Math.round(1 / CUADRO_SEG);
  if (cuadrosPorSegundo === delMundo) return null;
  return (
    `las trazas están grabadas a ${cuadrosPorSegundo} cuadros por segundo y mundo.ts corre a ${delMundo}: ` +
    'regrabá todas (node scripts/resolver-niveles.mjs --regrabar --todos --buscar)'
  );
}

export interface Diagnostico {
  /** La traza leída, o `null` si no hay o no se lee. */
  readonly traza: Traza | null;
  /** Su repetición, si se pudo leer. */
  readonly repeticion: Repeticion | null;
  /** Lo que falla, con los mensajes del test. Vacío: la traza vale. */
  readonly problemas: readonly string[];
}

/**
 * Lo que `soluciones.test.ts` diría de la traza de un nivel, de una pasada: reglas 3 a 8. Lo
 * usa el script para saber qué nivel está en rojo; el test mira regla por regla, con las mismas
 * funciones, así que los mensajes son los mismos.
 */
export function diagnosticar(banco: Banco, nivel: Nivel, renglones: readonly string[] | undefined): Diagnostico {
  if (renglones === undefined) {
    return { traza: null, repeticion: null, problemas: problemasDeCorrespondencia([nivel.id], []) };
  }
  const lectura = leerTraza(nivel.id, renglones);
  if (lectura.traza === null) return { traza: null, repeticion: null, problemas: lectura.problemas };
  const traza = lectura.traza;
  const repeticion = repetir(banco, nivel, traza);
  const problemas = [...lectura.problemas];
  const deLaRepeticion = problemasDeLaRepeticion(repeticion, largoDe(traza), 'uno');
  if (deLaRepeticion.length > 0) {
    problemas.push(`${nivel.id} · ${deLaRepeticion.join(' · ')}. Para regrabarla: ${comandoParaRegrabar(nivel.id)}`);
  } else {
    const t = problemaDeTolerancia(banco, nivel, traza);
    if (t !== null) problemas.push(t);
  }
  return { traza, repeticion, problemas };
}
