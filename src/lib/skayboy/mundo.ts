/**
 * El mundo de Skayboy y Poligirl, sin motor: la sala, los dos cuerpos y la regla de la
 * puerta doble. Todo lo que el juego **decide** vive acá; lo que el motor hace es dibujarlo.
 *
 * ## Por qué existe, si el motor ya trae física
 *
 * Kaplay trae cuerpos, gravedad y colisión, y no se usan. Tres razones, y la tercera es la
 * que pesa:
 *
 * 1. **No se tree-shakea** (`T-226`): usar menos motor no baja un byte, así que apoyarse en
 *    su física no ahorra nada y ata la regla del juego a una versión que `ADR-08` ya dice
 *    que se va a cambiar ("actualizar de versión es una decisión").
 * 2. **La licencia de 3001.x no es MIT plana** (`RES-70`). Que la regla del juego no
 *    dependa del motor deja la salida a LittleJS en una tarde de dibujo, no en una
 *    reescritura.
 * 3. **Se puede probar con `node --test`.** Las reglas que sostienen `D-40`, `D-43` y
 *    `UX-29` —el que espera está a salvo, el fracaso devuelve a la entrada y no toca al
 *    otro, se gana con los dos en su puerta— son exactamente las que no se pueden dejar a
 *    "se ve bien en el teléfono". Acá cada una tiene su caso en rojo (`mundo.test.ts`).
 *
 * ## Quién lo consume, para que nadie lo escriba dos veces
 *
 * Nace en `T-254` (ciclo 15). **`T-248` —la puerta doble y el fin del nivel 1— consume
 * `paso()` y no reescribe la condición de victoria**: sus tres casos declarados viven en
 * `niveles.test.ts` y corren contra este módulo. **`T-247` —la isla— no lo llama directo**:
 * le da el tiempo de cada tic a `jugarTic()`, que lo reparte en cuadros y juega un `paso()` con
 * `CUADRO_SEG` por cuadro (`T-267`, `ADR-09.1`), y dibuja lo que queda en `cuerpos`; los
 * sucesos que devuelve son la única vía por la que la isla se entera de algo. Ninguna de las dos decide física por su cuenta. Y la
 * traza grabada (`soluciones.ts`) juega exactamente eso: los mismos `paso()` con el mismo `dt`.
 *
 * ## Los mecanismos (`CTR-16.10`, `T-272`)
 *
 * Palanca, placa, compuerta y caja viven acá desde `T-272`, con las cuatro reglas del
 * contrato y nada más:
 *
 * 1. **Ninguna pieza tiene reloj.** Nada se abre por un rato ni se cierra después de un rato.
 *    Lo único que se mueve solo es una caja que termina el tramo que le dieron, o cae.
 * 2. **Nada le mueve el piso a un cuerpo, salvo su propia columna de mando.** Ni el otro, ni
 *    una caja, ni una compuerta: por eso las compuertas son verticales, los cuerpos se
 *    atraviesan, y una caja no arranca ni sigue con alguien encima.
 * 3. **El que ocupa, gana.** Una compuerta no se cierra sobre nadie; una caja no entra donde
 *    hay alguien: frena y espera. Ninguna pieza tiene fuerza.
 * 4. **El orden en que el mundo recorre a los dos no decide nada.** En cada subpaso se mueven
 *    los dos cuerpos, después las cajas, y recién después se resuelven los mecanismos; lo que
 *    los dos hacen para lados opuestos en el mismo subpaso se anula, y lo que hacen los dos a
 *    la vez no es de ninguno (`por: null`).
 *
 * ## Lo que este módulo no importa (`CTR-16.8`)
 *
 * Nada de `node:*`, nada del motor, nada del DOM, ningún reloj. Lo lee la isla en el
 * navegador y la prueba en Node. El tiempo entra por parámetro (`dt`, en segundos) y el
 * mando también: **el mundo no sabe qué es un dedo**, sabe qué teclas están apretadas.
 *
 * ## Unidades
 *
 * Píxeles **nativos** (`UX-27 §2`: el área es 240 × 144, tiles de 16) y segundos. La escala
 * ×2 del teléfono en horizontal es asunto del canvas (`ADR-08.3`), no de la física: un
 * salto mide lo mismo en vertical que en horizontal, que es lo que `UX-28 §4` promete
 * ("nada más aparece ni desaparece al girar").
 *
 * ## Las constantes son de partida, no de diseño
 *
 * Ningún documento fija la gravedad ni la velocidad, y no es un olvido: se fijan jugando
 * (`T-249`). Lo que sí está fijado, y la prueba lo hace cumplir, es **el alcance que un
 * nivel puede pedir**: dos tiles de alto y tres de hueco. Si alguien afina los números, que
 * afine sin romper eso, porque los niveles se dibujan contra el alcance, no contra la
 * gravedad.
 */

import {
  celdasDeTipo,
  devuelveA,
  posicionDe,
  terrenoEn,
  tramosDeCompuertas,
  type Banco,
  type IdPersonaje,
  type Nivel,
  type Posicion,
  type Terreno,
  type TramoDeCompuerta,
} from './niveles.ts';

/** Los dos, en el orden en que se reparten las columnas de mando (`UX-28 §2`). */
export const PERSONAJES: readonly IdPersonaje[] = ['skayboy', 'poligirl'];

/** El tile, en píxeles nativos (`CTR-16.2`). También es lo que mide una caja: un tile (`CTR-16.10.5`). */
export const TILE = 16;

/**
 * La caja de colisión **del cuerpo**: **10 × 20** nativos, dentro de la celda de 16 × 24
 * (`UX-27 §2`, cerrado en `REV-14`). Más angosta que el tile a propósito: entra por un hueco
 * de un tile sin rozar, que es "nada de precisión fina" dicho en píxeles.
 *
 * Se llamaban `CAJA_ANCHO` y `CAJA_ALTO` hasta `T-272`, y se renombraron antes de que existiera
 * la caja que se empuja (`CTR-16.10.5`): dos cajas distintas en el mismo archivo eran un
 * defecto esperando. **Y una consecuencia para el que dibuja niveles:** un cuerpo mide 20 de
 * alto y una celda 16, así que **una compuerta de una sola celda con sólido arriba no la pasa
 * nadie**, abierta o cerrada. El tramo que se cruza caminando tiene por lo menos dos celdas.
 */
export const CUERPO_ANCHO = 10;
export const CUERPO_ALTO = 20;

/** px/s². Provisional (`T-249`). */
export const GRAVEDAD = 900;
/** px/s hacia arriba al despegar. Con `GRAVEDAD` da ~40 px de alto: dos tiles y medio. */
export const IMPULSO_SALTO = 270;
/** px/s al correr. Provisional (`T-249`). */
export const VELOCIDAD = 88;
/** px/s. El techo de la caída, para que nada atraviese un piso de un tile. */
export const CAIDA_MAXIMA = 320;

/**
 * px/s. **A qué velocidad anda una caja empujada** (`CTR-16.10.5`): provisional como las otras
 * (`T-249`) y nunca mayor que `VELOCIDAD` —lo mira `mundo.test.ts`—. Sesenta es medio píxel por
 * subpaso, exacto en punto flotante: un tile son 32 subpasos justos, 16 cuadros, y la caja llega
 * a su celda sin redondeo.
 */
export const VELOCIDAD_EMPUJE = 60;

/**
 * Lo que el juego perdona del salto, porque `UX-28 §2.1` agrandó la tecla y eso cubre dónde
 * cae el dedo, no cuándo. Son las dos ventanas clásicas del género:
 *
 * - **Tarde:** se puede saltar un rato después de dejar el borde.
 * - **Temprano:** un toque un poco antes de tocar el piso se guarda y salta al aterrizar.
 */
export const PERDON_TARDE_SEG = 0.1;
export const PERDON_TEMPRANO_SEG = 0.12;

/** El sub-paso de la integración. A 1/120 nada cruza medio tile en un paso. */
export const SUBPASO_SEG = 1 / 120;
/**
 * El paso más largo que se acepta. Si la pestaña se escondió y volvió, el mundo **no**
 * simula los segundos perdidos: la isla pausa, y lo que llegue igual se topea acá. Un
 * cuerpo que salta tres tiles porque el teléfono se trabó es un fracaso que nadie causó.
 */
export const PASO_MAXIMO_SEG = 1 / 20;

/**
 * **Un cuadro: el único `dt` con el que se juega una partida** (`ADR-09.1`). Lo usan los tres
 * que juegan —la isla en el teléfono, la traza grabada en cada `npm test` y el solucionador—,
 * y este es el único lugar del repo donde vive el número (`CTR-18.11`).
 *
 * Existe porque `paso()` parte cada llamada en subpasos de `dt / n`, y dos `dt` distintos
 * integran distinto: con el tic del teléfono temblando alrededor de 16,67 ms, el vértice de un
 * salto variaba entre 39,4 y 39,7 px nativos. Poco, y justo lo que da vuelta un borde de la
 * traza. Con un `dt` fijo, la física que prueba la máquina es la del teléfono, bit a bit.
 *
 * Es `2 × SUBPASO_SEG` exacto —dividir por dos no redondea—, así que un cuadro son dos
 * subpasos de `SUBPASO_SEG` sin error, y la garantía de medio tile de arriba queda escrita tal
 * cual. `paso()` sigue aceptando cualquier `dt` (`mundo.test.ts` lo prueba con cinco segundos);
 * lo que se fija es que quien juega lo llama siempre con este.
 */
export const CUADRO_SEG = 1 / 60;

/**
 * Cuántos cuadros puede ponerse al día un tic del motor: **3**, que es `PASO_MAXIMO_SEG` dicho
 * en cuadros. No es un número nuevo, es la promesa de arriba —nunca avanzar más de 1/20 s entre
 * dos dibujos— con la unidad de la partida; por eso se deriva y no se escribe: si alguien
 * mueve una de las dos constantes, el tope la sigue.
 */
export const TOPE_CUADROS_POR_TIC = Math.round(PASO_MAXIMO_SEG / CUADRO_SEG);

/**
 * Medio cuadro de fase para el reloj de la isla. Con el acumulador en cero, una pantalla de
 * 60 Hz queda justo sobre el umbral y el temblor del tic corre cero cuadros en uno y dos en el
 * siguiente: un tirón que se ve. Arrancando en medio cuadro, un temblor de hasta medio cuadro
 * para cada lado no cambia la cuenta. Es aritmética, y `mundo.test.ts` la hace.
 */
export const FASE_SEG = CUADRO_SEG / 2;

/** Lo que un tic del motor le deja a la isla: cuántos cuadros jugar, y el tiempo que sobró. */
export interface Reparto {
  readonly cuadros: number;
  /** Lo que todavía no alcanza para un cuadro entero. El reloj lo guarda para el tic siguiente. */
  readonly acumulado: number;
}

/**
 * **El reloj del motor hecho cuadros** (`ADR-09.1`). `jugarTic()` le pasa lo que tenía acumulado y
 * el `dt` del tic, y recibe cuántos `paso(…, CUADRO_SEG)` jugar. Tres reglas y ninguna más:
 *
 * 1. **Cuadros enteros.** El tiempo se junta hasta completar un cuadro; lo que no llega a uno
 *    queda para el tic siguiente.
 * 2. **Tope de `TOPE_CUADROS_POR_TIC` por tic**, contra la espiral clásica del paso fijo —el
 *    acumulador crece y cada tic simula más—. Acá no puede venir de la CPU —tres cuadros
 *    cuestan microsegundos—: viene de la pestaña que se escondió y volvió, del teléfono que se
 *    trabó medio segundo.
 * 3. **Lo que no entró en el tope se tira.** El mundo no recupera el tiempo que el teléfono
 *    estuvo trabado: un cuerpo que avanza medio segundo de golpe con la tecla apretada hizo algo
 *    que la persona no vio. Si el teléfono no llega a veinte tics por segundo, el juego se pone
 *    en cámara lenta en vez de saltearse la física, que es lo honesto. El acumulador vuelve a
 *    la fase.
 *
 * Vive acá y no en la isla porque la isla no se puede cargar en Node (toca el DOM al
 * importarla), y estas tres reglas son justo las que hay que ver en rojo. Un `dt` que no es un
 * número positivo no suma nada.
 */
export function repartirEnCuadros(acumulado: number, dt: number): Reparto {
  let resto = acumulado + (dt > 0 ? dt : 0);
  let cuadros = 0;
  while (resto >= CUADRO_SEG && cuadros < TOPE_CUADROS_POR_TIC) {
    resto -= CUADRO_SEG;
    cuadros += 1;
  }
  if (resto >= CUADRO_SEG) resto = FASE_SEG;
  return { cuadros, acumulado: resto };
}

/** Lo que el nivel le puede pedir a un salto, en tiles. Lo hace cumplir `mundo.test.ts`. */
export const ALCANCE_ALTO_TILES = 2;
export const ALCANCE_HUECO_TILES = 3;

/** Las tres teclas de una columna (`UX-28 §2.1`). Nada más: ni deslizar ni mantener. */
export interface Mando {
  readonly izquierda: boolean;
  readonly derecha: boolean;
  readonly saltar: boolean;
}

export const QUIETO: Mando = { izquierda: false, derecha: false, saltar: false };

/** Las dos columnas. La que no se toca llega como `QUIETO` (`D-43`: no hay botón de cambio). */
export type Mandos = Readonly<Record<IdPersonaje, Mando>>;

export interface Cuerpo {
  readonly id: IdPersonaje;
  /** Esquina de arriba a la izquierda de la caja de colisión, en píxeles nativos. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  enSuelo: boolean;
  /** Hacia dónde mira: la pose de perfil necesita saberlo (`UX-28 §3`). */
  mira: -1 | 1;
  /**
   * Si tiene un dedo encima. Decide la pose: de perfil si sí, de frente si no
   * (`UX-28 §3`). No decide nada más — el que espera no vale menos que el otro.
   */
  conDedo: boolean;
  /** Si está parado en su puerta. */
  enPuerta: boolean;
  /** Estado interno de las dos ventanas de perdón y del flanco de la tecla. */
  desdeElSuelo: number;
  saltoGuardado: number;
  saltoApretado: boolean;
  yaSalto: boolean;
}

/**
 * Una palanca de la sala (`CTR-16.10.2`): **queda para el lado que la cruzaste caminando.**
 * Hacia la derecha, activa; hacia la izquierda, en reposo. Arranca en reposo.
 */
export interface Palanca {
  readonly id: string;
  readonly columna: number;
  readonly fila: number;
  activa: boolean;
}

/**
 * Una placa (`CTR-16.10.3`): **abre mientras algo la pisa** —un cuerpo en el suelo con el medio
 * de los pies en su celda, o una caja quieta en su celda—, en el mismo subpaso en que cambia lo
 * que tiene encima.
 */
export interface Placa {
  readonly id: string;
  readonly columna: number;
  readonly fila: number;
  pisada: boolean;
}

/**
 * Una compuerta viva (`CTR-16.10.4`): el tramo que dibuja la grilla, con su **estado real** —no
 * el mandato—. Cerrada es sólido y abierta es aire, sin un tercer estado; y puede estar abierta
 * con el mandato de cerrar, esperando que el que está adentro salga.
 */
export interface Compuerta extends TramoDeCompuerta {
  abierta: boolean;
}

/**
 * Por qué una caja en movimiento no pudo seguir en un cuadro, y a quién esperó (`CTR-16.10.5`):
 * **arriba** de un cuerpo que se metió debajo mientras caía, **contra** uno que se metió en la
 * celda a la que iba, o **debajo** de uno que se le subió mientras andaba. Las tres son una
 * carrera, y la traza de uno no puede pasar por ninguna (regla 11 de `CTR-18.6`).
 */
export interface Espera {
  readonly quien: IdPersonaje;
  readonly donde: 'arriba' | 'contra' | 'debajo';
}

/**
 * **La caja que se empuja** (`CTR-16.10.5`): escalón y tapón, nunca martillo. Un tile. Descansa
 * siempre en la grilla, se mueve de a una celda y termina su tramo aunque el que empujaba se
 * detenga; si abajo no hay apoyo, cae con la misma gravedad que los cuerpos. Nunca vuelve a la
 * entrada: los molinetes devuelven cuerpos, no cosas.
 */
export interface Caja {
  /** Esquina de arriba a la izquierda, en píxeles nativos. Quieta, es la de su celda. */
  x: number;
  y: number;
  /** La celda donde está, o **la celda donde va a quedar** mientras anda: el tramo y la caída ya se decidieron. */
  columna: number;
  fila: number;
  /** `quieta` en su celda, en su `tramo` de costado, o `cae` hacia la fila donde apoya. */
  estado: 'quieta' | 'tramo' | 'cae';
  /** Para qué lado va el tramo. Cero si no anda de costado. */
  direccion: -1 | 0 | 1;
  /** Velocidad de caída, px/s. Cero si no cae. */
  vy: number;
  /**
   * **Quién la empujó la última vez**, o nadie si la empujaron los dos a la vez. Es de quién es
   * lo que abre una caja parada en una placa (`CTR-16.10.7`), y lo lee la paridad.
   */
  empujadaPor: IdPersonaje | null;
  /**
   * Si **en este cuadro** —el último `paso()`— tuvo que esperar a alguien, y a quién. No decide
   * nada de la física: se borra al empezar cada `paso()` y se anota en el subpaso en que la caja
   * no pudo seguir. Lo lee `soluciones.ts` para la regla 11.
   */
  espera: Espera | null;
}

/**
 * Lo que pasó en un paso, para que la isla haga lo suyo: tres suenan (`CTR-17`, los mismos
 * tres nombres que `sonido.ts`) y uno solo se ve.
 *
 * **`vuelta` no suena** (`UX-29 §5`, `CTR-17.6`). Lo que hace la isla con ella es la pasada
 * de imprenta sobre el área (`UX-29 §3`) y el aviso para el lector de pantalla, que nombra
 * el lugar y no a la persona.
 *
 * **`compuerta` tampoco suena** (`CTR-16.10.7`, cuatro motivos): la isla lo deja pasar callado y
 * dibuja el estado del mundo, no el suceso. Se emite cuando la compuerta **cambia de verdad**
 * —no cuando cambia el mandato—, y `por` es el autor del cambio si fue uno solo: el que cruzó la
 * palanca, el que pisó o soltó la placa, o el `empujadaPor` de la caja que llegó o se fue. Es
 * `null` cuando lo hicieron los dos en el mismo subpaso, o cuando la cerró el lugar —el cierre
 * que esperaba a que el tramo quedara libre—. Lo consume la paridad (`CTR-18.8`).
 */
export type Suceso =
  | { readonly tipo: 'salto'; readonly quien: IdPersonaje }
  | { readonly tipo: 'tesoro'; readonly quien: IdPersonaje }
  | { readonly tipo: 'vuelta'; readonly quien: IdPersonaje }
  | { readonly tipo: 'puerta' }
  | { readonly tipo: 'compuerta'; readonly id: string; readonly abierta: boolean; readonly por: IdPersonaje | null };

export interface Mundo {
  readonly banco: Banco;
  readonly nivel: Nivel;
  readonly cuerpos: Readonly<Record<IdPersonaje, Cuerpo>>;
  /** Tesoros ya juntados, como `"columna,fila"`. No vuelven al fallar: lo conseguido se queda. */
  readonly juntados: Set<string>;
  /**
   * Las piezas de la sala con estado (`CTR-16.10`), en el orden de la grilla. Vacías en un nivel
   * que no tiene ninguna. Lo que no cambia —qué mecanismo manda qué compuerta— no vive acá: se
   * lee del nivel.
   */
  readonly palancas: readonly Palanca[];
  readonly placas: readonly Placa[];
  readonly compuertas: readonly Compuerta[];
  readonly cajas: readonly Caja[];
  /**
   * El reloj de la partida, en segundos. **Es lo único que cuesta fallar** (`UX-29 §4`):
   * no hay contador y no hay pantallas. Corre igual para los dos y se congela al ganar.
   */
  tiempo: number;
  terminado: boolean;
}

/* =========================================================================================
   La sala: lo que no cambia en una partida
   ========================================================================================= */

/**
 * Lo que la sala tiene de fijo, leído una vez por nivel: dónde está cada pieza, qué compuerta
 * hay en cada celda y **qué mecanismos manda cada compuerta**. No es estado del mundo —dos copias
 * del mundo lo comparten sin riesgo, como comparten el nivel—, y por eso no está en `Mundo`.
 */
interface Sala {
  readonly palancas: readonly (Posicion & { readonly id: string })[];
  readonly placas: readonly (Posicion & { readonly id: string })[];
  readonly tramos: readonly TramoDeCompuerta[];
  readonly cajas: readonly Posicion[];
  /** El índice del tramo de cada celda de compuerta, por `fila * ANCHO_CLAVE + columna`. */
  readonly compuertaEn: ReadonlyMap<number, number>;
  /** Por compuerta: los índices de las palancas y las placas que la mandan (`mecanismos[].abre`). */
  readonly mandos: readonly { readonly palancas: readonly number[]; readonly placas: readonly number[] }[];
  /** Sin ninguna pieza, el subpaso es el de antes de `T-272` y no aloca nada. */
  readonly vacia: boolean;
}

/** Más que el ancho de cualquier grilla: la clave numérica de una celda. */
const ANCHO_CLAVE = 64;

function armarSala(banco: Banco, nivel: Nivel): Sala {
  const idEn = ({ columna, fila }: Posicion): string =>
    nivel.mecanismos.find((m) => m.en[0] === columna && m.en[1] === fila)?.id ?? `(sin id, [${columna}, ${fila}])`;
  const palancas = celdasDeTipo(banco, nivel, 'palanca').map((p) => ({ ...p, id: idEn(p) }));
  const placas = celdasDeTipo(banco, nivel, 'placa').map((p) => ({ ...p, id: idEn(p) }));
  const tramos = tramosDeCompuertas(banco, nivel);
  const compuertaEn = new Map<number, number>();
  tramos.forEach((t, i) => {
    for (let fila = t.desdeFila; fila <= t.hastaFila; fila++) compuertaEn.set(fila * ANCHO_CLAVE + t.columna, i);
  });
  const mandos = tramos.map((t) => {
    const abrenEsta = nivel.mecanismos.filter((m) => m.abre.includes(t.id));
    const mandan = (piezas: readonly Posicion[]): number[] =>
      piezas.flatMap((p, i) => (abrenEsta.some((m) => m.en[0] === p.columna && m.en[1] === p.fila) ? [i] : []));
    return { palancas: mandan(palancas), placas: mandan(placas) };
  });
  const cajas = celdasDeTipo(banco, nivel, 'caja');
  return {
    palancas,
    placas,
    tramos,
    cajas,
    compuertaEn,
    mandos,
    vacia: palancas.length + placas.length + tramos.length + cajas.length === 0,
  };
}

/**
 * La sala de un nivel, armada una sola vez. Es una memoria de una función pura —el mismo banco y
 * el mismo nivel dan la misma sala—, no un estado: por eso puede vivir afuera del mundo.
 */
const SALAS = new WeakMap<Nivel, { readonly banco: Banco; readonly sala: Sala }>();

function salaDe(banco: Banco, nivel: Nivel): Sala {
  const guardada = SALAS.get(nivel);
  if (guardada !== undefined && guardada.banco === banco) return guardada.sala;
  const sala = armarSala(banco, nivel);
  SALAS.set(nivel, { banco, sala });
  return sala;
}

/* =========================================================================================
   Crear el mundo
   ========================================================================================= */

/** Dónde aparece el cuerpo cuando está en su entrada: parado en el piso del tile, centrado. */
export function puntoDeEntrada(banco: Banco, nivel: Nivel, id: IdPersonaje): { x: number; y: number } {
  const entrada = posicionDe(banco, nivel, 'entrada', id);
  if (entrada === undefined) {
    // `CTR-16.5` regla 1 lo hace imposible en un banco sano; si llega acá, el dato no pasó
    // por `problemasDelBanco()` y el juego no tiene dónde poner a nadie.
    throw new Error(`${nivel.id}: no hay entrada para ${id} (CTR-16.5 regla 1)`);
  }
  return {
    x: entrada.columna * TILE + (TILE - CUERPO_ANCHO) / 2,
    y: (entrada.fila + 1) * TILE - CUERPO_ALTO,
  };
}

function cuerpoNuevo(banco: Banco, nivel: Nivel, id: IdPersonaje): Cuerpo {
  const { x, y } = puntoDeEntrada(banco, nivel, id);
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    // Apoyado, sin mirar la grilla: es cierto por construcción, porque `CTR-16.5` regla 3 le pide
    // a toda entrada sólido abajo, y un banco que no la cumple no pasa `problemasDelBanco()` (E8).
    enSuelo: true,
    mira: 1,
    conDedo: false,
    enPuerta: false,
    desdeElSuelo: 0,
    saltoGuardado: 0,
    saltoApretado: false,
    yaSalto: false,
  };
}

export function crearMundo(banco: Banco, nivel: Nivel): Mundo {
  const sala = salaDe(banco, nivel);
  return {
    banco,
    nivel,
    cuerpos: {
      skayboy: cuerpoNuevo(banco, nivel, 'skayboy'),
      poligirl: cuerpoNuevo(banco, nivel, 'poligirl'),
    },
    juntados: new Set(),
    // Todo arranca en reposo (`CTR-16.10.2`), libre y cerrado: nada puede estar pisando una
    // placa en el cuadro cero, porque los cuerpos están en su entrada y las cajas en su `n`.
    palancas: sala.palancas.map(({ id, columna, fila }) => ({ id, columna, fila, activa: false })),
    placas: sala.placas.map(({ id, columna, fila }) => ({ id, columna, fila, pisada: false })),
    compuertas: sala.tramos.map((t) => ({ ...t, abierta: false })),
    cajas: sala.cajas.map(({ columna, fila }) => ({
      x: columna * TILE,
      y: fila * TILE,
      columna,
      fila,
      estado: 'quieta' as const,
      direccion: 0 as const,
      vy: 0,
      empujadaPor: null,
      espera: null,
    })),
    tiempo: 0,
    terminado: false,
  };
}

/* =========================================================================================
   Qué frena a quién
   ========================================================================================= */

/** Media millonésima de píxel: lo que separa "apoyado" de "adentro" cuando la cuenta no es exacta. */
const EPS = 1e-6;

/** Si dos tramos `[a, a + la)` y `[b, b + lb)` se meten uno en el otro. Apoyarse no es meterse. */
function solapan(a: number, la: number, b: number, lb: number): boolean {
  return a < b + lb - EPS && b < a + la - EPS;
}

function terreno(mundo: Mundo, columna: number, fila: number): Terreno | undefined {
  return terrenoEn(mundo.banco, mundo.nivel, { columna, fila });
}

function compuertaEn(mundo: Mundo, columna: number, fila: number): Compuerta | undefined {
  const i = salaDe(mundo.banco, mundo.nivel).compuertaEn.get(fila * ANCHO_CLAVE + columna);
  return i === undefined ? undefined : mundo.compuertas[i];
}

/**
 * Si esa celda frena un cuerpo. **Afuera de la grilla es pared** (`UX-29 §7.1`: no hay
 * vacío, el nivel es una sala cerrada), así que aunque un nivel se dibuje sin borde nadie
 * sale del mundo.
 *
 * Una **compuerta** frena mientras está cerrada (`CTR-16.10.4`). Palanca, placa y la celda
 * donde arranca una caja son aire: la caja que se empuja no es una celda, es una cosa del mundo,
 * y frena por su cuenta, en `moverEnX` y `moverEnY`.
 */
function frena(mundo: Mundo, columna: number, fila: number): boolean {
  const t = terreno(mundo, columna, fila);
  if (t === undefined) return true;
  if (t.tipo === 'solido') return true;
  if (t.tipo === 'compuerta') return compuertaEn(mundo, columna, fila)?.abierta !== true;
  return false;
}

/** La fila de la celda donde están los pies: la de la puerta, la palanca o la placa que se pisa. */
function filaDeLosPies(y: number): number {
  return Math.floor((y + CUERPO_ALTO - 1) / TILE);
}

/** Las celdas que toca la caja de colisión, con el borde derecho y el de abajo excluidos. */
function celdasDe(c: Cuerpo): { columna: number; fila: number }[] {
  const celdas: { columna: number; fila: number }[] = [];
  const c0 = Math.floor(c.x / TILE);
  const c1 = Math.floor((c.x + CUERPO_ANCHO - 0.001) / TILE);
  const f0 = Math.floor(c.y / TILE);
  const f1 = Math.floor((c.y + CUERPO_ALTO - 0.001) / TILE);
  for (let fila = f0; fila <= f1; fila++) {
    for (let columna = c0; columna <= c1; columna++) celdas.push({ columna, fila });
  }
  return celdas;
}

/** Un cuerpo caminando contra el costado de una caja quieta: el pedido de empujarla. */
interface Empuje {
  readonly caja: number;
  readonly direccion: -1 | 1;
  readonly quien: IdPersonaje;
}

function moverEnX(mundo: Mundo, c: Cuerpo, dx: number, empujes: Empuje[] | null): void {
  if (dx === 0) return;
  let x = c.x + dx;
  const f0 = Math.floor(c.y / TILE);
  const f1 = Math.floor((c.y + CUERPO_ALTO - 0.001) / TILE);
  const columna = dx > 0 ? Math.floor((x + CUERPO_ANCHO - 0.001) / TILE) : Math.floor(x / TILE);
  for (let fila = f0; fila <= f1; fila++) {
    if (frena(mundo, columna, fila)) {
      x = dx > 0 ? columna * TILE - CUERPO_ANCHO : (columna + 1) * TILE;
      c.vx = 0;
      break;
    }
  }
  // Las cajas son sólidas por todos lados (`CTR-16.10.5`). Frena contra la más cercana.
  if (mundo.cajas.length === 0) {
    c.x = x;
    return;
  }
  let tocada = false;
  for (const k of mundo.cajas) {
    if (!solapan(c.y, CUERPO_ALTO, k.y, TILE)) continue;
    if (dx > 0 && c.x + CUERPO_ANCHO <= k.x + EPS && x + CUERPO_ANCHO > k.x + EPS) {
      x = k.x - CUERPO_ANCHO;
      tocada = true;
    } else if (dx < 0 && c.x >= k.x + TILE - EPS && x < k.x + TILE - EPS) {
      x = k.x + TILE;
      tocada = true;
    }
  }
  c.x = x;
  if (!tocada) return;
  c.vx = 0;
  // **Se empuja caminando contra ella**: en el suelo, con los pies a la altura de su base, contra
  // su costado. El pedido se anota y se resuelve después de mover a los dos (regla 4).
  if (empujes === null || !c.enSuelo) return;
  const direccion = dx > 0 ? 1 : -1;
  mundo.cajas.forEach((k, caja) => {
    const costado = direccion > 0 ? k.x - CUERPO_ANCHO : k.x + TILE;
    if (Math.abs(c.x - costado) > EPS || !solapan(c.y, CUERPO_ALTO, k.y, TILE)) return;
    if (Math.abs(c.y + CUERPO_ALTO - (k.y + TILE)) > EPS) return;
    empujes.push({ caja, direccion, quien: c.id });
  });
}

function moverEnY(mundo: Mundo, c: Cuerpo, dy: number): void {
  if (dy === 0) return;
  let y = c.y + dy;
  const c0 = Math.floor(c.x / TILE);
  const c1 = Math.floor((c.x + CUERPO_ANCHO - 0.001) / TILE);
  const fila = dy > 0 ? Math.floor((y + CUERPO_ALTO - 0.001) / TILE) : Math.floor(y / TILE);
  for (let columna = c0; columna <= c1; columna++) {
    if (frena(mundo, columna, fila)) {
      y = dy > 0 ? fila * TILE - CUERPO_ALTO : (fila + 1) * TILE;
      c.vy = 0;
      break;
    }
  }
  for (const k of mundo.cajas) {
    if (!solapan(c.x, CUERPO_ANCHO, k.x, TILE)) continue;
    if (dy > 0 && c.y + CUERPO_ALTO <= k.y + EPS && y + CUERPO_ALTO > k.y + EPS) {
      // Se le sube encima: es el escalón de `RES-61.5`, y sube el alcance un tile.
      y = k.y - CUERPO_ALTO;
      c.vy = 0;
    } else if (dy < 0 && c.y >= k.y + TILE - EPS && y < k.y + TILE - EPS) {
      y = k.y + TILE;
      c.vy = 0;
    }
  }
  c.y = y;
}

/** Si hay piso justo abajo de los pies: una celda que frena, o el techo de una caja. */
function pisa(mundo: Mundo, c: Cuerpo): boolean {
  const pies = c.y + CUERPO_ALTO;
  if (pies % TILE === 0) {
    const fila = pies / TILE;
    const c0 = Math.floor(c.x / TILE);
    const c1 = Math.floor((c.x + CUERPO_ANCHO - 0.001) / TILE);
    for (let columna = c0; columna <= c1; columna++) {
      if (frena(mundo, columna, fila)) return true;
    }
  }
  for (const k of mundo.cajas) {
    if (Math.abs(pies - k.y) < EPS && solapan(c.x, CUERPO_ANCHO, k.x, TILE)) return true;
  }
  return false;
}

/**
 * Si el cuerpo está parado en su puerta: los pies en la celda de la puerta y en el piso.
 * Se mide con el punto del medio de los pies, no con la caja entera — pararse "casi
 * adentro" cuenta, que es otra vez "nada de precisión fina".
 */
function estaEnSuPuerta(mundo: Mundo, c: Cuerpo): boolean {
  if (!c.enSuelo) return false;
  const columna = Math.floor((c.x + CUERPO_ANCHO / 2) / TILE);
  const t = terreno(mundo, columna, filaDeLosPies(c.y));
  return t !== undefined && t.tipo === 'puerta' && t.de === c.id;
}

/**
 * Devuelve el cuerpo a su entrada (`UX-29 §3`): **de una, sin animación propia y sin
 * bloquear el mando** — el dedo responde desde el cuadro cero. El otro no se entera
 * (`D-38` baranda 3), y los tesoros juntados se quedan juntados. No cruza nada en el camino:
 * no mueve palancas (`CTR-16.10.2`).
 */
function devolver(mundo: Mundo, c: Cuerpo): void {
  const { x, y } = puntoDeEntrada(mundo.banco, mundo.nivel, c.id);
  c.x = x;
  c.y = y;
  c.vx = 0;
  c.vy = 0;
  // Apoyado por construcción, como al crear el mundo: `CTR-16.5` regla 3 (E8).
  c.enSuelo = true;
  c.enPuerta = false;
  c.desdeElSuelo = 0;
  c.saltoGuardado = 0;
  c.yaSalto = false;
}

/** Mueve un cuerpo un subpaso. Devuelve `true` si volvió a la entrada. */
function moverCuerpo(
  mundo: Mundo,
  c: Cuerpo,
  mando: Mando,
  dt: number,
  sucesos: Suceso[],
  empujes: Empuje[] | null,
): boolean {
  // Correr: se sostiene y perdona. Las dos a la vez se anulan, que es lo que un pulgar que
  // se apoya entre las dos teclas espera que pase.
  const direccion = (mando.derecha ? 1 : 0) - (mando.izquierda ? 1 : 0);
  c.vx = direccion * VELOCIDAD;
  if (direccion !== 0) c.mira = direccion > 0 ? 1 : -1;

  // Saltar: se toca. El flanco guarda el pedido; el pedido vive `PERDON_TEMPRANO_SEG`.
  if (mando.saltar && !c.saltoApretado) c.saltoGuardado = PERDON_TEMPRANO_SEG;
  c.saltoApretado = mando.saltar;

  if (c.enSuelo) {
    c.desdeElSuelo = 0;
    c.yaSalto = false;
  } else {
    c.desdeElSuelo += dt;
  }

  if (c.saltoGuardado > 0 && !c.yaSalto && c.desdeElSuelo <= PERDON_TARDE_SEG) {
    c.vy = -IMPULSO_SALTO;
    c.enSuelo = false;
    c.yaSalto = true;
    c.saltoGuardado = 0;
    sucesos.push({ tipo: 'salto', quien: c.id });
  }
  c.saltoGuardado = Math.max(0, c.saltoGuardado - dt);

  c.vy = Math.min(c.vy + GRAVEDAD * dt, CAIDA_MAXIMA);
  moverEnX(mundo, c, c.vx * dt, empujes);
  moverEnY(mundo, c, c.vy * dt);
  c.enSuelo = c.vy >= 0 && pisa(mundo, c);

  for (const { columna, fila } of celdasDe(c)) {
    const t = terreno(mundo, columna, fila);
    if (devuelveA(t, c.id)) {
      devolver(mundo, c);
      sucesos.push({ tipo: 'vuelta', quien: c.id });
      return true;
    }
    if (t !== undefined && t.tipo === 'tesoro' && (t.para ?? []).includes(c.id)) {
      const clave = `${columna},${fila}`;
      if (!mundo.juntados.has(clave)) {
        mundo.juntados.add(clave);
        sucesos.push({ tipo: 'tesoro', quien: c.id });
      }
    }
  }
  return false;
}

/* =========================================================================================
   Las cajas (CTR-16.10.5)
   ========================================================================================= */

/**
 * Si una caja entra en esa celda **por lo que es la celda** (la tabla de `CTR-16.10.5`). Entra en
 * aire, placa, compuerta abierta y molinete —el tapón de trampa—; no entra en sólido, compuerta
 * cerrada, palanca, tesoro, entrada, puerta, ni en la celda de arriba de una entrada o de una
 * puerta, ni afuera de la grilla. Que haya otra caja o un cuerpo se mira aparte.
 */
function cajaEntra(mundo: Mundo, columna: number, fila: number): boolean {
  const t = terreno(mundo, columna, fila);
  if (t === undefined) return false;
  const abajo = terreno(mundo, columna, fila + 1)?.tipo;
  if (abajo === 'entrada' || abajo === 'puerta') return false;
  switch (t.tipo) {
    case 'aire':
    case 'placa':
    case 'molinete':
    case 'caja':
      return true;
    case 'compuerta':
      return compuertaEn(mundo, columna, fila)?.abierta === true;
    default:
      return false;
  }
}

/** Si algún cuerpo se mete en esa celda. */
function hayCuerpoEn(mundo: Mundo, columna: number, fila: number): boolean {
  return PERSONAJES.some((id) => {
    const c = mundo.cuerpos[id];
    return solapan(c.x, CUERPO_ANCHO, columna * TILE, TILE) && solapan(c.y, CUERPO_ALTO, fila * TILE, TILE);
  });
}

/**
 * Si otra caja está en esa celda, o ya la tiene reservada: una caja que anda tiene decidido su
 * camino entero —la celda de al lado y la columna por la que cae—, y nadie más lo puede pedir.
 */
function hayOtraCajaEn(mundo: Mundo, columna: number, fila: number, salvo: number): boolean {
  return mundo.cajas.some((k, i) => {
    if (i === salvo) return false;
    if (solapan(k.x, TILE, columna * TILE, TILE) && solapan(k.y, TILE, fila * TILE, TILE)) return true;
    return k.estado !== 'quieta' && k.columna === columna && fila >= Math.floor((k.y + EPS) / TILE) && fila <= k.fila;
  });
}

/** Si una caja quieta (que no sea `salvo`) ocupa esa celda: es apoyo para otra. */
function cajaQuietaEn(mundo: Mundo, columna: number, fila: number, salvo: number): boolean {
  return mundo.cajas.some((k, i) => i !== salvo && k.estado === 'quieta' && k.columna === columna && k.fila === fila);
}

/**
 * **Dónde apoyaría** una caja que entra en `(columna, fila)`, o `null` si **la caída no es
 * limpia**: en la columna por la que caería, desde la celda de destino hasta donde apoyaría, hay
 * un cuerpo, otra caja, o una celda donde una caja no entra (`CTR-16.10.5`, el empujón no arranca,
 * punto 3). Apoya en sólido, en compuerta cerrada, en otra caja quieta o en el borde.
 */
function dondeApoya(mundo: Mundo, caja: number, columna: number, fila: number): number | null {
  for (let f = fila; ; f++) {
    if (!cajaEntra(mundo, columna, f) || hayCuerpoEn(mundo, columna, f) || hayOtraCajaEn(mundo, columna, f, caja)) return null;
    const abajo = terreno(mundo, columna, f + 1);
    if (abajo === undefined || frena(mundo, columna, f + 1) || cajaQuietaEn(mundo, columna, f + 1, caja)) return f;
  }
}

/** Quién está parado encima de la caja, si alguien. Una caja no se mueve con alguien encima. */
function cuerpoEncima(mundo: Mundo, k: Caja): IdPersonaje | null {
  for (const id of PERSONAJES) {
    const c = mundo.cuerpos[id];
    if (Math.abs(c.y + CUERPO_ALTO - k.y) < EPS && solapan(c.x, CUERPO_ANCHO, k.x, TILE)) return id;
  }
  return null;
}

/**
 * Si otra caja está apoyada arriba de `k`, **o va a apoyarse**. La segunda mitad es la que importa:
 * una caja que anda ya decidió en el arranque dónde apoya (`dondeApoya`), y si ese apoyo es `k`,
 * `k` es su piso desde ese subpaso. Empujarla mientras la otra todavía anda la dejaría quieta en
 * el aire, porque el tramo y la caída terminan en la celda que se decidió sin volver a mirar abajo
 * (`CTR-16.10.5`: *apoya alineada en sólido o en otra caja*). Con dos personas se llega: una empuja
 * la de arriba y la otra, a la vez, la de abajo.
 */
function cajaEncima(mundo: Mundo, k: Caja): boolean {
  return mundo.cajas.some(
    (otra) =>
      otra !== k &&
      ((Math.abs(otra.y + TILE - k.y) < EPS && solapan(otra.x, TILE, k.x, TILE)) ||
        (otra.estado !== 'quieta' && otra.columna === k.columna && otra.fila === k.fila - 1)),
  );
}

/**
 * Los empujones del subpaso, **después de mover a los dos** (regla 4). Una caja arranca un tramo
 * si está quieta, no tiene nada encima —ni caja ni cuerpo: empujarla con el otro arriba es
 * llevarlo (`BR-23` punto 4)—, la celda de al lado la deja entrar y la caída es limpia. Los dos
 * para lados opuestos: se anulan. Los dos para el mismo lado: arranca, y no es de ninguno. Si
 * dos cajas piden el mismo lugar en el mismo subpaso, no arranca ninguna: decidiría el orden de
 * la lista. Y **la que es el apoyo de otra que arranca en el mismo subpaso no arranca**: es el
 * caso de `cajaEncima` con las dos empujadas a la vez, y la de arriba ya contó con ella.
 */
function empujar(mundo: Mundo, empujes: readonly Empuje[]): void {
  if (empujes.length === 0) return;
  // Primero se decide todo con la sala como estaba, y recién después se mueve algo: si no, la
  // segunda caja se decidiría mirando a la primera ya corrida.
  const arranques: {
    readonly caja: number;
    readonly direccion: -1 | 1;
    readonly columna: number;
    readonly desde: number;
    readonly apoya: number;
    readonly quienes: readonly IdPersonaje[];
  }[] = [];
  mundo.cajas.forEach((k, caja) => {
    const pedidos = empujes.filter((e) => e.caja === caja);
    if (pedidos.length === 0 || k.estado !== 'quieta') return;
    const direccion = pedidos[0].direccion;
    if (pedidos.some((e) => e.direccion !== direccion)) return;
    if (cuerpoEncima(mundo, k) !== null || cajaEncima(mundo, k)) return;
    const apoya = dondeApoya(mundo, caja, k.columna + direccion, k.fila);
    if (apoya === null) return;
    const quienes = [...new Set(pedidos.map((e) => e.quien))];
    arranques.push({ caja, direccion, columna: k.columna + direccion, desde: k.fila, apoya, quienes });
  });
  const sostiene = (a: (typeof arranques)[number]): boolean => {
    const k = mundo.cajas[a.caja];
    return arranques.some((b) => b !== a && b.columna === k.columna && b.apoya + 1 === k.fila);
  };
  const quedan = arranques.filter((a) => !sostiene(a));
  for (const a of quedan) {
    const choca = quedan.some((b) => b !== a && b.columna === a.columna && b.desde <= a.apoya && a.desde <= b.apoya);
    if (choca) continue;
    const k = mundo.cajas[a.caja];
    k.estado = 'tramo';
    k.direccion = a.direccion;
    k.columna = a.columna;
    k.fila = a.apoya;
    k.empujadaPor = a.quienes.length === 1 ? a.quienes[0] : null;
  }
}

/**
 * Una caja que anda, un subpaso: sigue su tramo o su caída. **Frena contra el cuerpo que se le
 * metió en el camino y espera** hasta que el lugar se libere, sin empujarlo ni apretarlo; y con
 * alguien encima no se mueve, porque sería moverle el piso (regla 2). Quieta, está siempre en una
 * celda: el tramo y la caída terminan justo en la grilla.
 */
function moverCaja(mundo: Mundo, k: Caja, h: number): void {
  if (k.estado === 'quieta') return;
  const encima = cuerpoEncima(mundo, k);
  if (encima !== null) {
    k.espera = { quien: encima, donde: 'debajo' };
    return;
  }
  if (k.estado === 'tramo') {
    const destino = k.columna * TILE;
    let x = k.x + k.direccion * VELOCIDAD_EMPUJE * h;
    if (k.direccion > 0 ? x > destino : x < destino) x = destino;
    for (const id of PERSONAJES) {
      const c = mundo.cuerpos[id];
      if (!solapan(x, TILE, c.x, CUERPO_ANCHO) || !solapan(k.y, TILE, c.y, CUERPO_ALTO)) continue;
      x = k.direccion > 0 ? Math.max(k.x, Math.min(x, c.x - TILE)) : Math.min(k.x, Math.max(x, c.x + CUERPO_ANCHO));
      k.espera = { quien: id, donde: 'contra' };
    }
    k.x = x;
    if (x !== destino) return;
    k.direccion = 0;
    if (k.y === k.fila * TILE) k.estado = 'quieta';
    else {
      k.estado = 'cae';
      k.vy = 0;
    }
    return;
  }
  // Cae, con la misma física que los cuerpos: una sola gravedad y un solo techo de caída.
  const destino = k.fila * TILE;
  k.vy = Math.min(k.vy + GRAVEDAD * h, CAIDA_MAXIMA);
  let y = Math.min(k.y + k.vy * h, destino);
  for (const id of PERSONAJES) {
    const c = mundo.cuerpos[id];
    if (!solapan(k.x, TILE, c.x, CUERPO_ANCHO) || !solapan(y, TILE, c.y, CUERPO_ALTO)) continue;
    y = Math.max(k.y, Math.min(y, c.y - TILE));
    k.vy = 0;
    k.espera = { quien: id, donde: 'arriba' };
  }
  k.y = y;
  if (y === destino) {
    k.estado = 'quieta';
    k.vy = 0;
  }
}

/* =========================================================================================
   Los mecanismos: palanca, placa y compuerta (CTR-16.10.2 a CTR-16.10.4, CTR-16.10.7)
   ========================================================================================= */

/** Quiénes pisan una placa: los cuerpos, y las cajas por su índice. */
interface Presentes {
  readonly cuerpos: readonly IdPersonaje[];
  readonly cajas: readonly number[];
}

function presentesEn(mundo: Mundo, l: Placa): Presentes {
  const cuerpos = PERSONAJES.filter((id) => {
    const c = mundo.cuerpos[id];
    return c.enSuelo && Math.floor((c.x + CUERPO_ANCHO / 2) / TILE) === l.columna && filaDeLosPies(c.y) === l.fila;
  });
  const cajas: number[] = [];
  mundo.cajas.forEach((k, i) => {
    if (k.estado === 'quieta' && k.columna === l.columna && k.fila === l.fila) cajas.push(i);
  });
  return { cuerpos, cajas };
}

/** Lo que había al empezar el subpaso: para ver qué cambió, y quién lo cambió. */
interface Antes {
  readonly cuerpos: Readonly<Record<IdPersonaje, { readonly x: number; readonly y: number; readonly enSuelo: boolean }>>;
  readonly activas: readonly boolean[];
  readonly pisadas: readonly boolean[];
  readonly presentes: readonly Presentes[];
}

function fotoDeAntes(mundo: Mundo): Antes {
  const { skayboy: s, poligirl: p } = mundo.cuerpos;
  return {
    cuerpos: {
      skayboy: { x: s.x, y: s.y, enSuelo: s.enSuelo },
      poligirl: { x: p.x, y: p.y, enSuelo: p.enSuelo },
    },
    activas: mundo.palancas.map((q) => q.activa),
    pisadas: mundo.placas.map((l) => l.pisada),
    presentes: mundo.placas.map((l) => presentesEn(mundo, l)),
  };
}

/** Si nadie —ni cuerpo ni caja— toca ninguna celda del tramo. */
function tramoLibre(mundo: Mundo, g: Compuerta): boolean {
  const x0 = g.columna * TILE;
  const y0 = g.desdeFila * TILE;
  const alto = (g.hastaFila - g.desdeFila + 1) * TILE;
  for (const id of PERSONAJES) {
    const c = mundo.cuerpos[id];
    if (solapan(c.x, CUERPO_ANCHO, x0, TILE) && solapan(c.y, CUERPO_ALTO, y0, alto)) return false;
  }
  return !mundo.cajas.some((k) => solapan(k.x, TILE, x0, TILE) && solapan(k.y, TILE, y0, alto));
}

/** El autor de un cambio **si es uno solo**; si fueron los dos, o una caja sin autor, nadie (`CTR-16.10.7`). */
function unico(autores: readonly (IdPersonaje | null)[]): IdPersonaje | null {
  const primero = autores[0];
  if (primero === undefined || primero === null) return null;
  return autores.every((a) => a === primero) ? primero : null;
}

/**
 * Los mecanismos del subpaso, **después de mover a los dos y a las cajas** (regla 4).
 *
 * 1. **Palancas.** Un cuerpo en el suelo —al empezar y al terminar el subpaso—, con los pies en la
 *    fila de la palanca, cuyo centro pasa de un lado al otro del centro de la celda. Hacia la
 *    derecha queda activa, hacia la izquierda en reposo. Saltarla no la mueve; volver a la entrada
 *    tampoco; dos cruces opuestos en el mismo subpaso se anulan. El centro exacto cuenta como la
 *    derecha: así cada cruce es uno, sin memoria.
 * 2. **Placas.** Pisada si algo la pisa ahora.
 * 3. **Compuertas.** Mandadas abiertas si cualquiera de sus mecanismos está activo o pisado. Abrir
 *    es inmediato; cerrar también, **salvo con alguien adentro**: se queda abierta y espera. El
 *    suceso sale cuando cambia de verdad, con el autor del cambio de mandato si fue uno solo.
 */
function resolverMecanismos(
  mundo: Mundo,
  sala: Sala,
  antes: Antes,
  volvieron: readonly IdPersonaje[],
  sucesos: Suceso[],
): void {
  const autoresDePalanca: (readonly IdPersonaje[] | null)[] = mundo.palancas.map((p) => {
    const centro = p.columna * TILE + TILE / 2;
    let hacia: -1 | 0 | 1 = 0;
    let anulada = false;
    const quienes: IdPersonaje[] = [];
    for (const id of PERSONAJES) {
      if (volvieron.includes(id)) continue;
      const a = antes.cuerpos[id];
      const c = mundo.cuerpos[id];
      if (!a.enSuelo || !c.enSuelo || filaDeLosPies(a.y) !== p.fila || filaDeLosPies(c.y) !== p.fila) continue;
      const ladoAntes = a.x + CUERPO_ANCHO / 2 < centro ? -1 : 1;
      const ladoAhora = c.x + CUERPO_ANCHO / 2 < centro ? -1 : 1;
      if (ladoAntes === ladoAhora) continue;
      if (hacia !== 0 && hacia !== ladoAhora) anulada = true;
      hacia = ladoAhora;
      quienes.push(id);
    }
    if (hacia === 0 || anulada || (hacia > 0) === p.activa) return null;
    p.activa = hacia > 0;
    return quienes;
  });

  const autoresDePlaca: (readonly (IdPersonaje | null)[] | null)[] = mundo.placas.map((l, j) => {
    const ahora = presentesEn(mundo, l);
    const pisada = ahora.cuerpos.length + ahora.cajas.length > 0;
    if (pisada === l.pisada) return null;
    l.pisada = pisada;
    // Pisarla es de los que llegaron; soltarla, de los que se fueron. De una caja, su `empujadaPor`
    // de ahora: la que se va, se va porque alguien la acaba de empujar.
    const quienes = pisada ? ahora : (antes.presentes[j] ?? { cuerpos: [], cajas: [] });
    return [...quienes.cuerpos, ...quienes.cajas.map((i) => mundo.cajas[i].empujadaPor)];
  });

  mundo.compuertas.forEach((g, i) => {
    const { palancas, placas } = sala.mandos[i];
    const mandadaAntes = palancas.some((p) => antes.activas[p]) || placas.some((l) => antes.pisadas[l]);
    const mandadaAhora = palancas.some((p) => mundo.palancas[p].activa) || placas.some((l) => mundo.placas[l].pisada);
    let por: IdPersonaje | null = null;
    if (mandadaAhora !== mandadaAntes) {
      // Los que cambiaron un mecanismo de esta compuerta **para el mismo lado que el mandato**.
      const autores: (IdPersonaje | null)[] = [];
      for (const p of palancas) {
        const quienes = autoresDePalanca[p];
        if (quienes !== null && mundo.palancas[p].activa === mandadaAhora) autores.push(...quienes);
      }
      for (const l of placas) {
        const quienes = autoresDePlaca[l];
        if (quienes !== null && mundo.placas[l].pisada === mandadaAhora) autores.push(...quienes);
      }
      por = unico(autores);
    }
    if (mandadaAhora && !g.abierta) {
      g.abierta = true;
      sucesos.push({ tipo: 'compuerta', id: g.id, abierta: true, por });
    } else if (!mandadaAhora && g.abierta && tramoLibre(mundo, g)) {
      g.abierta = false;
      // Si el mandato cambió recién, el cierre es del que lo cambió; si ya estaba mandada a cerrar
      // y esperaba a que el tramo se liberara, la cerró el lugar.
      sucesos.push({ tipo: 'compuerta', id: g.id, abierta: false, por: mandadaAhora !== mandadaAntes ? por : null });
    }
  });
}

/**
 * Un subpaso de la sala entera: los dos cuerpos, después las cajas, después los mecanismos. Sin
 * piezas en la sala es exactamente el subpaso de antes de `T-272`, y no aloca nada de más.
 */
function subpaso(mundo: Mundo, mandos: Mandos, h: number, sucesos: Suceso[]): void {
  const sala = salaDe(mundo.banco, mundo.nivel);
  if (sala.vacia) {
    for (const id of PERSONAJES) moverCuerpo(mundo, mundo.cuerpos[id], mandos[id], h, sucesos, null);
    return;
  }
  const antes = fotoDeAntes(mundo);
  const empujes: Empuje[] = [];
  const volvieron: IdPersonaje[] = [];
  for (const id of PERSONAJES) {
    if (moverCuerpo(mundo, mundo.cuerpos[id], mandos[id], h, sucesos, empujes)) volvieron.push(id);
  }
  empujar(mundo, empujes);
  for (const k of mundo.cajas) moverCaja(mundo, k, h);
  resolverMecanismos(mundo, sala, antes, volvieron, sucesos);
}

/**
 * Avanza el mundo `dt` segundos con esos mandos, y devuelve lo que pasó.
 *
 * **Se gana con los dos parados en su puerta al mismo tiempo** (`CTR-16.5` regla 2), y la
 * regla no se parametriza por nivel. El que llegó primero espera sin que le cueste nada más
 * que el reloj, que corre igual para los dos; y como el que no tiene dedo encima no se
 * mueve, esperar en la puerta es gratis y seguro (`D-40`, `UX-28 §3`).
 */
export function paso(mundo: Mundo, mandos: Mandos, dt: number): readonly Suceso[] {
  if (mundo.terminado || !(dt > 0)) return [];
  const total = Math.min(dt, PASO_MAXIMO_SEG);
  const n = Math.max(1, Math.ceil(total / SUBPASO_SEG - 1e-9));
  const h = total / n;
  const sucesos: Suceso[] = [];

  for (const id of PERSONAJES) {
    const m = mandos[id];
    mundo.cuerpos[id].conDedo = m.izquierda || m.derecha || m.saltar;
  }
  // La espera de una caja es de este cuadro: la de antes ya pasó.
  for (const k of mundo.cajas) k.espera = null;

  for (let i = 0; i < n; i++) {
    subpaso(mundo, mandos, h, sucesos);
    mundo.tiempo += h;
    for (const id of PERSONAJES) {
      const c = mundo.cuerpos[id];
      c.enPuerta = estaEnSuPuerta(mundo, c);
    }
    if (PERSONAJES.every((id) => mundo.cuerpos[id].enPuerta)) {
      mundo.terminado = true;
      sucesos.push({ tipo: 'puerta' });
      break;
    }
  }
  return sucesos;
}

/** Si alguna caja todavía anda —en su tramo o cayendo—. La traza de uno no cambia de columna así (regla 11). */
export function algunaCajaAnda(mundo: Mundo): boolean {
  return mundo.cajas.some((k) => k.estado !== 'quieta');
}

/**
 * **El reloj de la isla** (`ADR-09.1`): lo que el motor trajo y todavía no alcanza para un
 * cuadro. Lo crea `crearReloj()`, lo avanza `jugarTic()`, y nadie más lo toca.
 */
export interface Reloj {
  acumulado: number;
}

/** Un reloj nuevo, **en la fase** (`FASE_SEG`), no en cero: ver la nota de `FASE_SEG`. */
export function crearReloj(): Reloj {
  return { acumulado: FASE_SEG };
}

/**
 * **Un tic del motor, entero** (`ADR-09.1`, `T-267`): reparte `dt` en cuadros con
 * `repartirEnCuadros()`, guarda lo que sobra en el reloj, y juega ese número de
 * `paso(…, CUADRO_SEG)` con los mismos mandos. Devuelve los sucesos de todos los cuadros, en
 * orden.
 *
 * Vive acá y no en la isla por lo mismo que `repartirEnCuadros()`: la isla no se carga en
 * Node, y cada línea de este tic —que el reloj arranque en la fase, que se quede con lo que
 * sobró, que se jueguen los cuadros del reparto y no otros, que el `dt` de `paso()` sea
 * `CUADRO_SEG`— tiene que poder verse en rojo. `mundo.test.ts` lo juega; `motor.test.ts`
 * mira que la isla lo llame con `k.dt()` y no haga nada más con el tiempo.
 */
export function jugarTic(reloj: Reloj, mundo: Mundo, mandos: Mandos, dt: number): readonly Suceso[] {
  const reparto = repartirEnCuadros(reloj.acumulado, dt);
  reloj.acumulado = reparto.acumulado;
  const sucesos: Suceso[] = [];
  for (let cuadro = 0; cuadro < reparto.cuadros; cuadro++) sucesos.push(...paso(mundo, mandos, CUADRO_SEG));
  return sucesos;
}

/**
 * La pose que dibuja la isla (`UX-28 §3`): **de perfil si tiene un dedo encima, de frente
 * si no.** Son dos formas y ninguna es un color. No hay pose de caída propia —la invertida
 * de la hoja no entra (`UX-29 §6`)— ni de espera que se duerma.
 */
export type Pose = 'frente' | 'perfil-quieto' | 'perfil-corre' | 'perfil-aire';

export function poseDe(c: Cuerpo): Pose {
  if (!c.conDedo) return 'frente';
  if (!c.enSuelo) return 'perfil-aire';
  return c.vx !== 0 ? 'perfil-corre' : 'perfil-quieto';
}
