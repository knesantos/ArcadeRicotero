/**
 * Los tres efectos de Skayboy y Poligirl (`CTR-17`).
 *
 * **Salto, tesoro y puerta. Tres, y ninguno más.** Eran cinco a la mañana: `FIND-57` sacó
 * uno porque en este juego a nadie lo consume nada, y `D-43` sacó el otro porque no hay
 * botón de cambio y un efecto sin disparador es código que nadie va a poder oír.
 *
 * ## Se sintetizan: cero archivos, cero bytes, cero `decodeAudioData`
 *
 * Es lo que el sitio ya hace dos veces —la cama de `ADR-04` y la púa de `ADR-07.7` son
 * ruido generado en memoria— y `CTR-17.4` lo presupuesta en **0 bytes de red y 0 MB de
 * RAM**: los tres que quedan son osciladores puros, sin un solo `AudioBuffer`. Un
 * `salto.mp3` sería el primer archivo de audio del sitio que no es una grabación de la
 * banda, y habría que conseguirlo, licenciarlo y fichar de dónde salió por 200 ms de
 * sonido.
 *
 * ## El fracaso no suena, y el silencio no es un valor bajo: es la decisión
 *
 * `UX-29` prohíbe con nombre el grito, el quejido y la música de derrota, y su `§9` deja la
 * verificación en una línea: mirar un fallo con el sonido prendido, y si algo suena, está
 * mal. Acá el terreno ajeno no lastima, **no te deja pasar**: te devuelve a la entrada, y
 * eso se ve —el área hace una pasada de imprenta sobre sí misma— sin mitad sonora
 * (`CTR-17.6`). Por eso `sonar()` no tiene un cuarto nombre que aceptar, y por eso el que
 * venga a "agregarle un toquecito" al fallo tiene que pasar primero por `CTR-17.1`.
 *
 * ## Un solo `AudioContext`, y este archivo no lo construye
 *
 * `ADR-07.10` punto 7, sin descuento: el contexto es el de `audio/contexto.ts` y acá se
 * pide **prestado**. Se pide con `contextoVivo()` y no con `contextoDeAudio()`, que es la
 * diferencia entre mirar y tocar: construir el contexto desde el bucle de un juego sería
 * construirlo fuera de un gesto, o sea empezar a sonar sin que nadie lo haya pedido, que es
 * justo lo que `ADR-04.4` prohíbe. El motor de juego trae el suyo y está apagado
 * (`ADR-08.2` punto 3).
 *
 * ## La compuerta de `CTR-17.5`: un interruptor, no tres
 *
 * Si la cinta está apagada, este juego se juega **en silencio entero**: ni tema ni efectos.
 * Acá eso se cumple por construcción y por contrato con la isla:
 *
 * - **Por construcción:** sin contexto vivo no hay `volumenEfectos`, y sin `volumenEfectos`
 *   `sonar()` devuelve `false` sin crear un nodo. En esta pantalla el único que construye el
 *   contexto es la cinta, así que quien nunca la prendió nunca oye un salto.
 * - **Por contrato:** `armarEfectos()` se llama desde adentro del gesto que prende la cinta
 *   y `soltarEfectos()` cuando se apaga. Es la isla la que engancha las dos puntas a
 *   `alCambiarLaCinta`, y **este módulo no le pregunta a `cinta.ts`** a propósito: colgarse
 *   de la cinta lo sacaría de la fila de módulos hoja de `D-29` y ataría la prueba de un
 *   efecto de 90 ms al grafo entero de la atmósfera.
 *
 * ## Una voz por disparo, y se suelta sola
 *
 * Los dos nodos de cada voz —oscilador y envolvente— se crean al disparar y se sueltan en
 * `onended`. No hay pool y no hay nodos vivos esperando: un plataformas dispara decenas de
 * veces por minuto y un pool es un `Map` que después nadie vacía. En reposo queda
 * un solo nodo, `volumenEfectos`; en el peor caso, nueve (`CTR-17.4`).
 *
 * Y todo se agenda contra `ctx.currentTime`: ni `setTimeout`, ni `setInterval`, ni un
 * `requestAnimationFrame` contando milisegundos. Dos relojes que no son el mismo no se
 * sincronizan a mano (`ADR-07.10` punto 12).
 */

import { contextoVivo } from '../audio/contexto.ts';

/** Los tres, y el tipo es la lista: lo que no está acá no se puede disparar. */
export type Efecto = 'salto' | 'tesoro' | 'puerta';

// ---------------------------------------------------------------------------------------
// Los números de `CTR-17.3`, que es **la cuarta tabla de audio del repo** y está declarada
// como tal para que no parezca una excepción escondida (`ADR-07.10` punto 11). Ningún
// número de audio se escribe dos veces: si uno de estos aparece suelto en la isla, es un
// defecto aunque suene bien. Se exportan porque las pruebas los necesitan, y una prueba que
// reescriba el número lo escribiría dos veces.
// ---------------------------------------------------------------------------------------

/** El volumen de los tres contra el tema que suena abajo. **Techo duro `0.4`.** */
export const GANANCIA_EFECTOS = 0.3;
/** El tope del contrato: **ninguno pasa de acá**. Uno largo se pisa con el siguiente. */
export const TOPE_EFECTO_SEG = 0.4;
/** Voces a la vez. **La quinta no suena: se descarta, no se encola.** */
export const VOCES_MAX = 4;
/** Nodos por voz: el oscilador y su envolvente. No hay un tercero. */
export const NODOS_POR_VOZ = 2;
/**
 * Dos disparos del mismo efecto adentro de esta ventana son uno solo.
 *
 * Es un cuadro a 60, y el tope es de `CTR-17.4`. Los dos saltando en el mismo instante
 * suenan una vez, y es lo correcto: dos voces idénticas en fase suman amplitud y se escucha
 * como un golpe, no como dos saltos.
 */
export const MISMO_CUADRO_SEG = 1 / 60;
/** Lo que tarda cualquiera en llegar a su pico. Sin rampa, la envolvente chasquea. */
export const ATAQUE_SEG = 0.004;
/** El piso de toda envolvente: `exponentialRampToValueAtTime` no puede llegar a cero. */
export const SILENCIO = 0.0001;

/** El salto: lo que dura el despegue. Es el verbo del juego. */
export const SALTO_SEG = 0.09;
/** De dónde arranca el barrido. */
export const SALTO_DESDE_HZ = 320;
/** Hasta dónde sube. **Hacia arriba**: un salto que baja de tono suena a caída. */
export const SALTO_HASTA_HZ = 660;
/** Su pico, contra el maestro. El salto es el que más veces suena: no puede ser el más alto. */
export const NIVEL_SALTO = 0.8;

/** Cada uno de los dos tonos del tesoro. */
export const TESORO_TONO_SEG = 0.07;
/** El aire entre los dos. Pegados suenan a un tono que se quiebra, no a dos. */
export const TESORO_HUECO_SEG = 0.01;
/** El primero. */
export const TESORO_HZ = 1320;
/** El segundo, **más agudo**: es lo que hace que suene a premio y no a aviso. */
export const TESORO_HZ_AGUDO = 1980;
/** Su pico. Arriba de esto, en auriculares, pincha. */
export const NIVEL_TESORO = 0.65;

/** La puerta: un tono sostenido que se apaga solo. El más largo de los tres. */
export const PUERTA_SEG = 0.35;
/**
 * Su tono. **Grave**, y eso es de `FIND-57`: con un efecto menos quedó libre el registro de
 * abajo, y la puerta tenía que salir del medio porque lo compartía con el salto. Los dos
 * pueden sonar en el mismo segundo —uno entra a la suya mientras el otro despega.
 */
export const PUERTA_HZ = 150;
/** La puerta no golpea: se abre. Por eso su ataque es cinco veces el de los otros dos. */
export const PUERTA_ATAQUE_SEG = 0.02;
/** Su pico. */
export const NIVEL_PUERTA = 0.7;

/** Los dos nodos de una voz. Se crean al disparar y se sueltan en `onended`. */
interface Voz {
  readonly osc: OscillatorNode;
  readonly envolvente: GainNode;
}

/** Lo que define a un efecto. La forma vive acá adentro, no en la isla. */
interface Ficha {
  readonly onda: OscillatorType;
  /** Lo que dura entero, desde el disparo hasta el `stop`. Nunca más que `TOPE_EFECTO_SEG`. */
  readonly largoSeg: number;
  /** El pico de su envolvente, contra `GANANCIA_EFECTOS`. */
  readonly nivel: number;
  /**
   * La banda que ocupa, de grave a aguda.
   *
   * Está declarada y no calculada porque es una promesa del contrato: **ninguno usa el
   * mismo registro que otro que pueda sonar al mismo tiempo** (`CTR-17.3`). Con tres
   * efectos y tres bandas la regla se cumple sola; el día que aparezca un cuarto, el que
   * tiene que buscarle lugar es el que lo agrega, y esta tupla es donde se ve si lo hizo.
   */
  readonly registro: readonly [number, number];
  /** Programa la voz en el reloj del audio. Nunca toca el reloj de la pantalla. */
  readonly programar: (voz: Voz, t0: number) => void;
}

/**
 * La envolvente de todos: sube en un instante y cae sola.
 *
 * El ataque se recorta si el gesto es más corto que el ataque, que no pasa hoy y pasaría el
 * día que alguien baje un largo a 3 ms. Y la caída es exponencial porque el oído escucha el
 * volumen en decibeles: una caída lineal se oye como un corte al final, no como algo que se
 * apaga.
 */
function envolver(param: AudioParam, inicio: number, fin: number, pico: number, ataque: number): void {
  param.setValueAtTime(0, inicio);
  param.linearRampToValueAtTime(pico, inicio + Math.min(ataque, (fin - inicio) / 3));
  param.exponentialRampToValueAtTime(SILENCIO, fin);
}

/**
 * Los tres, con su forma.
 *
 * **Que sean exactamente estas tres claves es lo que hace que el fracaso no dispare nada:**
 * no hay una cuarta entrada que alguien pueda llamar por error, y `sonar()` no inventa la
 * que no está.
 */
export const EFECTOS: Readonly<Record<Efecto, Ficha>> = {
  salto: {
    onda: 'square',
    largoSeg: SALTO_SEG,
    nivel: NIVEL_SALTO,
    registro: [SALTO_DESDE_HZ, SALTO_HASTA_HZ],
    programar: (voz, t0) => {
      // La rampa de frecuencia es exponencial porque el tono se oye en octavas, no en
      // hertz: una lineal sube todo el barrido al final y suena a resorte, no a despegue.
      voz.osc.frequency.setValueAtTime(SALTO_DESDE_HZ, t0);
      voz.osc.frequency.exponentialRampToValueAtTime(SALTO_HASTA_HZ, t0 + SALTO_SEG);
      envolver(voz.envolvente.gain, t0, t0 + SALTO_SEG, NIVEL_SALTO, ATAQUE_SEG);
    },
  },
  tesoro: {
    onda: 'square',
    largoSeg: TESORO_TONO_SEG * 2 + TESORO_HUECO_SEG,
    nivel: NIVEL_TESORO,
    registro: [TESORO_HZ, TESORO_HZ_AGUDO],
    programar: (voz, t0) => {
      // Dos tonos con **un solo oscilador**: la frecuencia salta en el hueco, que es cuando
      // la envolvente ya está abajo. Un segundo oscilador sería un tercer nodo por voz y
      // rompería el presupuesto de `CTR-17.4` por un tono que dura 70 ms.
      const segundo = t0 + TESORO_TONO_SEG + TESORO_HUECO_SEG;
      voz.osc.frequency.setValueAtTime(TESORO_HZ, t0);
      voz.osc.frequency.setValueAtTime(TESORO_HZ_AGUDO, segundo);
      envolver(voz.envolvente.gain, t0, t0 + TESORO_TONO_SEG, NIVEL_TESORO, ATAQUE_SEG);
      envolver(voz.envolvente.gain, segundo, segundo + TESORO_TONO_SEG, NIVEL_TESORO, ATAQUE_SEG);
    },
  },
  puerta: {
    onda: 'triangle',
    largoSeg: PUERTA_SEG,
    nivel: NIVEL_PUERTA,
    registro: [PUERTA_HZ, PUERTA_HZ],
    programar: (voz, t0) => {
      voz.osc.frequency.setValueAtTime(PUERTA_HZ, t0);
      envolver(voz.envolvente.gain, t0, t0 + PUERTA_SEG, NIVEL_PUERTA, PUERTA_ATAQUE_SEG);
    },
  },
};

/** El único nodo vivo en reposo. Uno por página, creado adentro del primer gesto. */
let volumen: GainNode | null = null;
/** Las voces que están sonando. Se vacía sola: cada una se borra en su `onended`. */
const voces = new Set<Voz>();
/**
 * Cuándo sonó cada efecto por última vez, en el reloj del audio.
 *
 * Es un mapa por efecto y no un instante único: que los dos salten juntos tiene que sonar
 * una vez, pero un salto y una puerta en el mismo cuadro son dos cosas distintas y las dos
 * se oyen.
 */
const ultimoDisparo = new Map<Efecto, number>();

/**
 * Arma el grafo. **Desde adentro de un gesto**, y una sola vez por página.
 *
 * Devuelve si quedó armado. `false` no es un error: es un navegador sin Web Audio, o la
 * cinta todavía apagada, y en los dos casos el juego se juega igual y en silencio — que es
 * lo que `CTR-17.5` decidió y lo que los molinetes abiertos exigen (`CTR-17.6`).
 */
export function armarEfectos(): boolean {
  if (volumen) return true;
  const ctx = contextoVivo();
  if (!ctx) return false;
  try {
    const maestro = ctx.createGain();
    maestro.gain.value = GANANCIA_EFECTOS;
    maestro.connect(ctx.destination);
    volumen = maestro;
    return true;
  } catch {
    // Un navegador que no deja ni esto tampoco va a dejar la cinta. El que llamó se entera
    // por lo que devolvemos, no con una excepción arriba del bucle del juego.
    volumen = null;
    return false;
  }
}

/** Suelta los dos nodos de una voz y la saca de la cuenta. Idempotente. */
function soltarVoz(voz: Voz): void {
  voces.delete(voz);
  for (const nodo of [voz.osc, voz.envolvente]) {
    try {
      nodo.disconnect();
    } catch {
      /* ya estaba suelto */
    }
  }
}

/**
 * Dispara un efecto. Devuelve si sonó.
 *
 * Los cuatro motivos por los que puede no sonar están todos en `CTR-17`, y ninguno es un
 * error que haya que reportar: no está armado (la cinta está apagada), el mismo efecto ya
 * sonó en este cuadro, hay cuatro voces vivas, o **el nombre no es uno de los tres**. Ese
 * último es la guarda de `UX-29`: acá no hay un efecto que se pueda pedir para el fallo.
 */
export function sonar(efecto: Efecto): boolean {
  // `Object.hasOwn` y no `EFECTOS[efecto]` a secas: sin esto, un nombre heredado del
  // prototipo —`constructor`, `toString`— devolvería algo que no es una ficha y el `try`
  // se lo tragaría en silencio. Acá el nombre que no está en la tabla no existe.
  if (!Object.hasOwn(EFECTOS, efecto)) return false;
  const ficha = EFECTOS[efecto];
  const ctx = contextoVivo();
  if (!ctx || !volumen) return false;

  const t0 = ctx.currentTime;
  const anterior = ultimoDisparo.get(efecto);
  if (anterior !== undefined && t0 - anterior < MISMO_CUADRO_SEG) return false;
  if (voces.size >= VOCES_MAX) return false;

  // Los dos nodos se anotan por separado y no adentro de un objeto de una línea: si el
  // segundo tira, el primero ya existe y hay que soltarlo. Un oscilador huérfano no suena
  // —no llegó a conectarse— pero el que venga a leer esto no puede tener que deducirlo.
  let osc: OscillatorNode | null = null;
  let envolvente: GainNode | null = null;
  let voz: Voz | null = null;
  try {
    osc = ctx.createOscillator();
    envolvente = ctx.createGain();
    voz = { osc, envolvente };
    osc.type = ficha.onda;
    osc.connect(envolvente).connect(volumen);
    ficha.programar(voz, t0);
    // El barrido de limpieza cuelga del `stop`, que es un evento del reloj del audio.
    // Encuestar acá sería mirar el otro reloj, y son dos (`ADR-07.10` punto 12).
    const esta = voz;
    osc.onended = () => soltarVoz(esta);
    osc.start(t0);
    osc.stop(t0 + ficha.largoSeg);
  } catch {
    for (const nodo of [osc, envolvente]) {
      if (!nodo) continue;
      try {
        nodo.disconnect();
      } catch {
        /* ya estaba suelto */
      }
    }
    if (voz) voces.delete(voz);
    return false;
  }

  voces.add(voz);
  ultimoDisparo.set(efecto, t0);
  return true;
}

/** Cuántas voces están sonando. Barato: no crea nada, no toca el contexto. */
export function vocesVivas(): number {
  return voces.size;
}

/** Si el grafo está armado. Lo mira la isla para no armar dos veces. */
export function efectosArmados(): boolean {
  return volumen !== null;
}

/**
 * Desarma todo: las voces que quedaron sonando y el maestro.
 *
 * Lo llama la isla cuando se apaga la cinta y cuando la pantalla se va. **Un maestro
 * colgado del destino después de apagar es una fuga que no se ve**, y la próxima voz que
 * alguien dispare sonaría con la cinta apagada — que es la única forma de romper
 * `CTR-17.5`.
 */
export function soltarEfectos(): void {
  for (const voz of [...voces]) {
    try {
      voz.osc.stop();
    } catch {
      /* nunca arrancó, o ya paró */
    }
    soltarVoz(voz);
  }
  voces.clear();
  ultimoDisparo.clear();
  if (volumen) {
    try {
      volumen.disconnect();
    } catch {
      /* ya estaba suelto */
    }
  }
  volumen = null;
}

/**
 * Deja el módulo como recién cargado. **Solo para las pruebas.**
 *
 * No desconecta nada a propósito: los nodos de una prueba son dobles y el caso siguiente
 * trae un contexto nuevo. Lo que hace falta es soltar las referencias, que es lo único que
 * esta función promete — un módulo que se queda con lo que vio al nacer no se puede probar
 * dos veces, que en este proyecto equivale a no existir.
 */
export function reiniciarEfectosParaPruebas(): void {
  voces.clear();
  ultimoDisparo.clear();
  volumen = null;
}
