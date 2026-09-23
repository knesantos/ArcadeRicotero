/**
 * La rocola: lo que suena cuando alguien prende la cinta en una pantalla que puede sonar
 * (`ADR-07`, `T-217`).
 *
 * Pone **un tema de la banda al azar**, con el aparato puesto encima: cuerpo recortado,
 * brillo caído y un arrastre que le mueve la afinación como una cinta gastada. Entre pieza y
 * pieza suena la púa. Cuando no hay temas enteros —que es el caso de hoy, y el que se va a
 * estrenar— pone **los recortes enteros**, los diez segundos completos, no la escalera de
 * `D-26`.
 *
 * ## El cuarto modo: `tema-fijo` (`D-39`, `ADR-08.9`, `T-244`)
 *
 * El mismo aparato pone además **un** tema, siempre el mismo, en la única pantalla que lo
 * declara (`CNT-20`). Mismo transporte, misma cadena, mismo interruptor, mismo rótulo. Dos
 * cosas lo separan de la rocola, y las dos son de lo que **no** hace:
 *
 * - **No sortea.** No hay vuelta, no se llama a `mezclar()`, y no le importa lo que la página
 *   haya sembrado: `sacarProxima()` devuelve la pieza fija y se termina. Es lo que hace
 *   defendible la excepción a `D-37`: un tema que no se sortea no es la respuesta de nadie,
 *   así que no hay nada que soplar.
 * - **No autoarranca.** El primer byte sigue necesitando un dedo sobre el interruptor
 *   (`ADR-07.8`, `ADR-08.9` regla 2). Y acá eso es por construcción, no por promesa: este
 *   módulo no registra un solo escucha ni programa nada al cargarse, así que la única forma
 *   de que suene es que alguien llame a `prenderTemaFijo()`, y el único que la llama es
 *   `cinta.ts` adentro del gesto. **Un juego que arranca música solo sería el primer molinete
 *   al revés del sitio.**
 *
 * ## Las tres reglas que no se negocian, y por qué
 *
 * 1. **Se transmite, no se decodifica.** `tema/audio.ts` decodifica a `AudioBuffer` con un
 *    tope de 3, y está bien para fragmentos de 15 s. Un tema de cuatro minutos decodificado
 *    son decenas de MB de RAM en un teléfono. Acá entra por `createMediaElementSource`, que
 *    deja la administración al navegador. **`decodeAudioData` no aparece en este archivo**, y
 *    `ADR-07` deja escrito el `grep` que lo verifica.
 * 2. **Nunca suena en una pantalla de juego.** Se mira la ruta **acá adentro**, aunque la
 *    isla ya la haya mirado: son los dos candados sobre la misma puerta del patrón de
 *    `graves.ts`, *"la toque quien la toque y desde donde la toque"*. Los recortes son las
 *    respuestas de `US-02`.
 * 3. **No precarga.** `preload = 'none'` y una pieza por vez. Un tema entero son 3–4 MB, y
 *    este sitio no le cierra la puerta al que tiene datos contados (`D-14`).
 *
 * ## El elemento vive fuera del documento, y además lleva marca
 *
 * `cinta.ts` barre los medios del documento para callarse cuando algo suena (`ADR-04.3`). Una
 * rocola que ponga temas por un `<audio>` del documento **se calla a sí misma en el primer
 * segundo**, y peor: el conjunto no se vacía nunca, así que se quedaría muda mientras el tema
 * siga sonando. Las dos formas juntas, porque una sola falla en silencio:
 *
 * - el elemento **nunca se inserta** — los eventos de un elemento desconectado no tienen al
 *   documento en su camino de propagación, y el barrido de arranque no lo encuentra;
 * - y lleva `dataset.cinta = 'rocola'`, para que el día que alguien lo inserte —controles
 *   nativos, la pantalla bloqueada del sistema— no se rompa sin que nadie entienda por qué.
 *
 * ## La cuarta importación, y por qué existe una hoja nueva
 *
 * `ADR-07.9` lista tres: `../audio/contexto.ts`, `./rutas-sonoras.ts` y `./pua.ts`. Hay una
 * cuarta, `../audio/rutas-de-audio.ts`, y es el resultado de un candado que saltó al
 * construir esto.
 *
 * La rocola necesita saber dónde vive el audio, y eso vivía adentro de `tema/audio.ts`.
 * Importarlo desde acá **cruza la flecha** que `ADR-04` puso a propósito entre los dos
 * motores —*"la dirección es única… si algún día se cruzan, la convivencia pasa a depender
 * de quién cargó primero"*—, y hay un test en `cinta.test.ts` que lo fija. Saltó, y tenía
 * razón. Escribir `/audio/fragmentos` de nuevo acá habría sido la otra salida mala: la
 * segunda verdad sobre dónde vive el audio, que el día que una cambie deja a la otra vieja
 * sin síntoma. Así que la constante bajó a una hoja que no importa nada, y los dos motores
 * la miran desde arriba **sin mirarse entre ellos**.
 *
 * ## El aviso de cambio de pieza, que `UX-21` no tenía
 *
 * `alCambiarLaCinta()` avisa cuando cambia el **estado**, y una rocola que pasa de un tema al
 * siguiente no cambia de estado: sigue `sonando`. Sin un aviso propio, el interruptor
 * mostraría para siempre el título de la primera pieza. Lo encontró `UX-26` y se resuelve con
 * `alCambiarLaPieza()`, que es de esta capa y no del contrato de `ADR-04`.
 */

import { modoEnRuta } from './rutas-sonoras.ts';
import { PUA_SEG, pua } from './pua.ts';
import { urlDeFragmento, urlDeTema } from '../audio/rutas-de-audio.ts';

// ---------------------------------------------------------------------------------------
// Las constantes de `ADR-07.5`. Ningún número de audio se escribe dos veces en este repo.
// ---------------------------------------------------------------------------------------

/** El nivel del tema. **Techo duro `1`**: arriba satura la suma con la cama. */
export const GANANCIA_ROCOLA = 0.9;
/** Saca el sub que el parlante del teléfono no da igual. */
export const CUERPO_HZ = 90;
/** La cinta no llega arriba. Abajo de ~4000 el tema suena tapado, no viejo. */
export const BRILLO_HZ = 7500;
/** Más rápido que el de la cama a propósito: acá se mide contra una nota afinada. */
export const BAMBOLEO_ROCOLA_HZ = 0.7;
/** **Tiene que ser mayor que la profundidad**, o el retardo se va a negativo. */
export const RETARDO_BASE_SEG = 0.004;
/** 0,26 % de desviación. **No pasa de `0.0015`**: arriba de ahí es un tema desafinado. */
export const PROFUNDIDAD_BAMBOLEO_ROCOLA = 0.0006;
/** Entra con la púa encima, así que no hace falta que sea lenta. */
export const SUBIDA_ROCOLA_SEG = 0.6;
/** Lo que tarda en irse antes de pausar. **No es `BAJADA_SEG`**: 20 ms sobre música es un corte. */
export const BAJADA_ROCOLA_SEG = 0.15;
/** Lo que hay entre pieza y pieza antes de la púa. No es silencio: abajo sigue la cama. */
export const DESCANSO_SEG = 0.8;
/** Tres piezas que no bajan y la rocola se rinde a `cama`. */
export const FALLAS_SEGUIDAS = 3;

const Q_CUERPO = 0.7;
const Q_BRILLO = 0.5;

/**
 * El apagado de emergencia de este módulo, aparte del de la cama. Literal, para grepear.
 *
 * Apaga **los dos modos que transfieren**, la rocola y `tema-fijo`: lo que corta es que el
 * sitio ponga temas, y el nombre quedó del día en que ese era el único.
 */
export const ROCOLA_HABILITADA = true;

// ---------------------------------------------------------------------------------------
// Los tipos
// ---------------------------------------------------------------------------------------

/** Un tema que la rocola puede poner. Lo imprime la página en build (`ADR-07.9`). */
export interface Pieza {
  readonly slug: string;
  readonly titulo: string;
  /** ¿Existe el tema entero? Si no, suena el recorte, completo. */
  readonly entero: boolean;
}

/**
 * La pieza del cuarto modo. **Una, y siempre la misma** (`CNT-20`, `D-39`).
 *
 * La eligió `contenido` con `experiencia`, y el `slug` y el título salen de
 * `src/data/cancionero.json` —leídos ahí antes de escribirlos acá, no citados de memoria—.
 * **El disco no se nombra**, ni en pantalla ni en este archivo: `D-39` condición 3 y
 * `UX-30 §5`. Cuál es está en la ficha.
 *
 * Está en el código y no la siembra la página, y conviene decir por qué. El candado C —la
 * siembra— existe para que una pantalla que se olvida de declarar sus temas se quede muda en
 * vez de sonar de más. Acá no hay nada que olvidarse: es una pieza, la misma siempre, y la
 * ruta que la habilita ya pasó por el censo de `PAGINAS_DECLARADAS`. Lo que queda como deuda
 * es de dónde sale el dato: `ADR-08.9` lo quiere en `temaFijo` de `src/data/skayboy.json`
 * (`CTR-16.2`), que todavía no existe.
 *
 * **`entero: true` con la carpeta de temas vacía es a propósito.** `D-39` promete el tema
 * entero, no diez segundos en repetición durante toda una partida. Mientras
 * `public/audio/temas/` no lo tenga, el pedido falla una vez y la cinta se cae a `cama` —que
 * es para lo que existe `rendirse()`—; el día que el mp3 baje, suena sin tocar una línea.
 */
export const TEMA_FIJO: Pieza = {
  slug: 'nam-fri-frufi-fali-fru',
  titulo: 'Ñam fri frufi fali fru',
  entero: true,
};

/** Los cinco nodos del inserto de `ADR-07.5`, vivos solo mientras la rocola está puesta. */
interface NodosRocola {
  readonly fuente: MediaElementAudioSourceNode;
  readonly cuerpo: BiquadFilterNode;
  readonly brillo: BiquadFilterNode;
  readonly arrastreCinta: DelayNode;
  readonly bamboleo: OscillatorNode;
  readonly profundidadBamboleo: GainNode;
  readonly volumenRocola: GainNode;
}

let piezas: readonly Pieza[] = [];
/**
 * ¿La rocola está puesta?
 *
 * **No alcanza con mirar `nodos`**, y ese es el caso 10 de `ADR-07`: si
 * `createMediaElementSource()` tira —pasa en algunos iOS—, el tema **tiene que sonar igual,
 * sin la cadena de filtro**. Quedarse sin efecto de casete es un detalle; quedarse sin música
 * porque el navegador no sabe filtrar es cerrarle el molinete a quien tiene el teléfono que
 * tiene (`D-14`). Con la cadena o sin ella, la rocola está puesta.
 */
let puesta = false;
/**
 * La pieza del modo `tema-fijo`, o `null` si lo que está puesto es la rocola.
 *
 * **Es el modo entero, escrito en un solo lugar.** No hay una variable `modo` además de
 * esta: mientras haya pieza fija no se sortea, no hay próxima y una falla no se reintenta, y
 * las tres cosas se preguntan por acá. Un booleano al lado de la pieza sería un segundo
 * estado que puede quedar desalineado con el primero.
 */
let fija: Pieza | null = null;
let vuelta: Pieza[] = [];
let sonando: Pieza | null = null;
let ultimaQueSono: Pieza | null = null;
let elemento: HTMLAudioElement | null = null;
/**
 * El contexto con el que se prendió.
 *
 * **Se guarda el que llega por argumento y no se le pregunta a `contexto.ts`.** No es
 * preferencia de estilo: `contextoVivo()` devuelve `null` hasta que alguien construya el
 * contexto, y una rocola que consulte por ahí depende del orden en que se cargaron los
 * módulos para saber si puede rampar un volumen. En producción funcionaba de casualidad
 * —`cinta.ts` despierta la salida antes de llamar acá— y en una prueba que pasa el contexto
 * a mano, el tema entraba mudo. El que manda es el que te dieron.
 */
let ctxRocola: AudioContext | null = null;
let nodos: NodosRocola | null = null;
let salidaDeLaCadena: AudioNode | null = null;
let fallas = 0;
let descanso: ReturnType<typeof setTimeout> | null = null;
let alRendirse: (() => void) | null = null;
const oyentesDePieza = new Set<(pieza: Pieza | null) => void>();

/**
 * La fuente se crea **una sola vez por sesión**, y esa no es una optimización.
 *
 * `createMediaElementSource()` sobre el mismo elemento **tira** la segunda vez
 * (`InvalidStateError`), y el elemento se reusa entre piezas a propósito: crear uno nuevo por
 * tema dejaría el anterior con su buffer colgado hasta que el recolector pase.
 */
let fuenteCreada = false;

// ---------------------------------------------------------------------------------------
// La vuelta (`ADR-07.6`)
// ---------------------------------------------------------------------------------------

/** Fisher-Yates sobre una copia. El mismo que usa el sorteo de la ronda en `desafio.ts`. */
function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/**
 * Arma una vuelta nueva: primero los que tienen entero, después los que solo tienen recorte.
 *
 * **La vuelta es de temas, no de archivos**, y esa es la decisión que evita el defecto que no
 * se ve hasta que pasa: si fuera de archivos, un tema con entero **y** con recorte saldría
 * dos veces por vuelta, una entera y otra en diez segundos.
 *
 * Con este orden, *"tema entero primero; cuando no hay más, recorte entero"* es literal:
 * cuando se acaban los enteros, lo que sigue son recortes. Hoy el primer tramo está vacío y
 * la vuelta son los 95 recortes sorteados, que es exactamente lo que el pedido describe.
 */
function armarVuelta(): Pieza[] {
  const conEntero = mezclar(piezas.filter((p) => p.entero));
  const soloRecorte = mezclar(piezas.filter((p) => !p.entero));
  const nueva = [...conEntero, ...soloRecorte];

  /*
   * El último tema que sonó no puede quedar primero.
   *
   * Sin esta línea, el empalme entre vueltas es el único lugar donde se puede oír el mismo
   * tema dos veces seguidas — y es justo el que se nota. Se lo corre al segundo lugar en vez
   * de sacarlo: sacarlo lo dejaría afuera de una vuelta entera.
   */
  if (nueva.length > 1 && ultimaQueSono && nueva[0]!.slug === ultimaQueSono.slug) {
    [nueva[0], nueva[1]] = [nueva[1]!, nueva[0]!];
  }
  return nueva;
}

/** La próxima pieza de la vuelta, rearmándola si se agotó. `null` si no hay con qué sonar. */
function sacarProxima(): Pieza | null {
  // El cuarto modo no sortea, y acá se ve: la pieza fija se devuelve antes de mirar la
  // vuelta, antes de `mezclar()` y antes de preguntar qué sembró la página. Aunque la
  // pantalla hubiera sembrado los 95 recortes, lo que suena es este tema y ningún otro.
  if (fija) return fija;
  if (piezas.length === 0) return null;
  if (vuelta.length === 0) vuelta = armarVuelta();
  return vuelta.shift() ?? null;
}

/** De cada tema suena la mejor pieza que tenga: el entero si existe, el recorte si no. */
function urlDe(pieza: Pieza): string {
  return pieza.entero ? urlDeTema(pieza.slug) : urlDeFragmento(pieza.slug);
}

// ---------------------------------------------------------------------------------------
// El aviso de pieza (`UX-26`)
// ---------------------------------------------------------------------------------------

/** Qué tema está sonando, o `null`. Es el candado 4 caído, y lo pinta `UX-26`. */
export function piezaSonando(): Pieza | null {
  return sonando;
}

/**
 * Para que el interruptor se entere de que cambió la pieza sin que cambie el estado.
 *
 * Devuelve cómo darse de baja. Mismo modal que `alCambiarLaCinta()`, y por el mismo motivo:
 * un interruptor que se da de baja mientras se le avisa es normal, y uno con un defecto no
 * puede llevarse puesto al resto.
 */
export function alCambiarLaPieza(oyente: (pieza: Pieza | null) => void): () => void {
  oyentesDePieza.add(oyente);
  return () => {
    oyentesDePieza.delete(oyente);
  };
}

function avisarPieza(): void {
  for (const oyente of [...oyentesDePieza]) {
    try {
      oyente(sonando);
    } catch {
      /* un interruptor roto no apaga la rocola */
    }
  }
}

// ---------------------------------------------------------------------------------------
// El grafo
// ---------------------------------------------------------------------------------------

/**
 * Arma el inserto de cinco nodos de `ADR-07.5` y lo cuelga de la salida.
 *
 * **El nodo que hace el truco es el `DelayNode`**, y es la única forma que hay acá: un
 * retardo de pocos milisegundos, modulado lento, corre la altura del tema igual que una cinta
 * que arrastra. Un `MediaElementAudioSourceNode` **no tiene `playbackRate`**, así que el
 * camino que usa la cama —modularle la velocidad a la fuente— no existe de este lado.
 *
 * Y la cadena de la cama **no se puede insertar sobre el tema**: es un modelador de ruido. Un
 * `lowpass` a 1400 Hz sobre una canción no suena a cinta, suena a una almohada encima del
 * parlante. El siseo sigue viniendo de abajo, de la cama de `ADR-04`, sin tocarle una
 * constante.
 */
function armarCadena(ctx: AudioContext, salida: AudioNode, medio: HTMLAudioElement): NodosRocola | null {
  const creados: Array<{ disconnect: () => void }> = [];
  const anotar = <T extends { disconnect: () => void }>(nodo: T): T => {
    creados.push(nodo);
    return nodo;
  };
  try {
    const fuente = anotar(ctx.createMediaElementSource(medio));
    fuenteCreada = true;

    const cuerpo = anotar(ctx.createBiquadFilter());
    cuerpo.type = 'highpass';
    cuerpo.frequency.value = CUERPO_HZ;
    cuerpo.Q.value = Q_CUERPO;

    const brillo = anotar(ctx.createBiquadFilter());
    brillo.type = 'lowpass';
    brillo.frequency.value = BRILLO_HZ;
    brillo.Q.value = Q_BRILLO;

    const arrastreCinta = anotar(ctx.createDelay(1));
    arrastreCinta.delayTime.value = RETARDO_BASE_SEG;

    const bamboleo = anotar(ctx.createOscillator());
    bamboleo.type = 'sine';
    bamboleo.frequency.value = BAMBOLEO_ROCOLA_HZ;

    const profundidadBamboleo = anotar(ctx.createGain());
    profundidadBamboleo.gain.value = PROFUNDIDAD_BAMBOLEO_ROCOLA;

    const volumenRocola = anotar(ctx.createGain());
    // Nace en cero y sube con la púa encima. Un tema que entra a volumen pleno sobre el
    // silencio de la cama es un salto, no un arranque.
    volumenRocola.gain.value = 0;

    fuente.connect(cuerpo);
    cuerpo.connect(brillo);
    brillo.connect(arrastreCinta);
    arrastreCinta.connect(volumenRocola);
    volumenRocola.connect(salida);

    // El bamboleo entra al `delayTime`, nunca al volumen: una entrada conectada a un
    // `AudioParam` **se suma** al valor, así que con el volumen en cero el oscilador seguiría
    // sumando y "callada" no sería silencio. Es la misma regla que `ADR-04` aprendió con
    // `respiracion`.
    bamboleo.connect(profundidadBamboleo);
    profundidadBamboleo.connect(arrastreCinta.delayTime);
    bamboleo.start();

    return { fuente, cuerpo, brillo, arrastreCinta, bamboleo, profundidadBamboleo, volumenRocola };
  } catch {
    for (const n of creados) {
      try {
        n.disconnect();
      } catch {
        /* ya estaba suelto */
      }
    }
    return null;
  }
}

/** Programa el volumen del tema. Es el único lugar del módulo que toca un `AudioParam`. */
function rampar(a: number, en: number): void {
  const ctx = ctxRocola;
  if (!nodos || !ctx) return;
  const p = nodos.volumenRocola.gain;
  try {
    p.cancelScheduledValues(ctx.currentTime);
    p.setValueAtTime(p.value, ctx.currentTime);
    p.linearRampToValueAtTime(a, ctx.currentTime + en);
  } catch {
    p.value = a;
  }
}

// ---------------------------------------------------------------------------------------
// Poner una pieza
// ---------------------------------------------------------------------------------------

function cancelarDescanso(): void {
  if (descanso === null) return;
  clearTimeout(descanso);
  descanso = null;
}

/**
 * Pone la próxima pieza: la púa y el `play()` **se piden juntos**, no uno después del otro.
 *
 * El motivo no es de gusto. Un `<audio>` que recién recibió su `src` tarda en dar la primera
 * muestra, y ese hueco sonaría a que el sitio se rompió. **La púa tapa la latencia de
 * arranque del stream.** Si el tema tarda más que `PUA_SEG`, abajo queda la cama y se aguanta.
 */
function ponerProxima(): void {
  cancelarDescanso();
  const ctx = ctxRocola;
  if (!elemento || !puesta || !ctx) return;

  const proxima = sacarProxima();
  if (!proxima) {
    rendirse();
    return;
  }

  sonando = proxima;
  ultimaQueSono = proxima;

  // El volumen arranca en cero y sube cuando la púa termina de caer.
  rampar(0, 0);
  if (salidaDeLaCadena) pua(ctx, salidaDeLaCadena);

  try {
    elemento.src = urlDe(proxima);
    const promesa = elemento.play();
    // `play()` devuelve una promesa en todos los navegadores vivos, pero no en los dobles de
    // las pruebas ni en los viejos. Se mira antes de encadenar en vez de suponerlo.
    if (promesa && typeof promesa.catch === 'function') promesa.catch(fallo);
  } catch {
    fallo();
    return;
  }

  rampar(GANANCIA_ROCOLA, SUBIDA_ROCOLA_SEG);
  avisarPieza();
}

/**
 * Una pieza que no baja.
 *
 * Queda gastada para esta vuelta —ya salió de `vuelta` en `sacarProxima()`— y se pasa a la
 * siguiente **sin reintentar el mismo archivo**. A las `FALLAS_SEGUIDAS`, la rocola se rinde.
 *
 * En `tema-fijo` no hay siguiente, así que la regla de arriba se cumple cayendo a `cama` de
 * una: volver a pedir el archivo que acaba de no bajar es exactamente el reintento que esta
 * función no hace, y con la púa encima cada vez.
 */
function fallo(): void {
  fallas++;
  if (fija || fallas >= FALLAS_SEGUIDAS) {
    rendirse();
    return;
  }
  ponerProxima();
}

/**
 * Rendirse es caer a `cama`, no apagarse.
 *
 * Un teléfono que perdió la red termina con la cama sonando, que no cuesta bytes, en vez de
 * en silencio. El silencio se leería como que la cinta se rompió, y la persona la tocaría
 * pensando eso.
 */
function rendirse(): void {
  const avisar = alRendirse;
  apagarRocola();
  avisar?.();
}

/** Terminó una pieza: descansa un momento y pone la que sigue. */
function alTerminar(): void {
  fallas = 0;
  cancelarDescanso();
  descanso = setTimeout(ponerProxima, DESCANSO_SEG * 1000);
}

// ---------------------------------------------------------------------------------------
// El contrato
// ---------------------------------------------------------------------------------------

/**
 * La lista que imprimió la página. **No baja nada, no suena nada, no crea un nodo.**
 *
 * Es el candado C: una pantalla que no siembra no tiene con qué sonar, así que el olvido cae
 * del lado del silencio.
 */
export function sembrarRocola(nuevas: readonly Pieza[]): void {
  piezas = nuevas;
  vuelta = [];
}

/** ¿Hay con qué? Barato: no crea nada y no mira el contexto. */
export function rocolaSembrada(): boolean {
  return piezas.length > 0;
}

/**
 * Arranca. **Solo desde adentro de un gesto**, y solo si la ruta lo permite.
 *
 * Devuelve si arrancó. `false` no es un error: es una pantalla donde la rocola no va, o una
 * que no sembró, y en los dos casos la cinta se queda con la cama.
 */
export function prenderRocola(ctx: AudioContext, salida: AudioNode, alRendirseFn?: () => void): boolean {
  return prender('rocola', null, ctx, salida, alRendirseFn);
}

/**
 * Arranca el cuarto modo: **un** tema, el de `TEMA_FIJO` (`D-39`, `ADR-08.9`).
 *
 * **Solo desde adentro de un gesto**, igual que la rocola, y solo en la ruta que lo declara.
 * `false` no es un error: es cualquier otra pantalla, y ahí la cinta se queda con la cama.
 *
 * No pide siembra —la pieza es esta, no la que imprimió la página— y por eso el candado C no
 * aplica: no hay olvido posible cuando no hay nada que declarar.
 */
export function prenderTemaFijo(ctx: AudioContext, salida: AudioNode, alRendirseFn?: () => void): boolean {
  return prender('tema-fijo', TEMA_FIJO, ctx, salida, alRendirseFn);
}

/**
 * El cuerpo de los dos, que es el mismo: un elemento, una cadena, una pieza y a sonar.
 *
 * Lo único que cambia entre modos son las dos primeras líneas —qué ruta lo habilita y de
 * dónde sale la pieza—, y por eso se escriben como argumento en vez de como un segundo
 * aparato. Dos rocolas paralelas serían dos elementos, dos cadenas y dos formas de apagar.
 */
function prender(
  modo: 'rocola' | 'tema-fijo',
  pieza: Pieza | null,
  ctx: AudioContext,
  salida: AudioNode,
  alRendirseFn?: () => void,
): boolean {
  if (!ROCOLA_HABILITADA) return false;
  if (typeof window === 'undefined') return false;
  // El segundo candado sobre la misma puerta. El primero lo pone la isla; este está acá para
  // que no pueda sonar en una pantalla de juego **la toque quien la toque y desde donde la
  // toque**. Los recortes son las respuestas de `US-02`.
  //
  // Se compara contra el modo que se está prendiendo y no contra `'rocola'` a secas: pedir
  // rocola en la pantalla del tema fijo, o tema fijo en el portal, cae del mismo lado.
  if (modoEnRuta(window.location?.pathname ?? '') !== modo) return false;
  if (modo === 'rocola' && !rocolaSembrada()) return false;
  if (puesta) return true;

  const medio = elemento ?? crearElemento();
  if (!medio) return false;
  elemento = medio;
  // Después del elemento y no antes: un navegador sin `Audio` se va por el `return false` de
  // arriba, y dejarle el modo puesto sería un estado que nadie va a apagar.
  fija = pieza;

  /*
   * Si la cadena no se puede armar, **la rocola se pone igual, sin filtro** (`ADR-07.4`,
   * caso 10). `createMediaElementSource()` tira en algunos iOS, y ahí la elección es entre
   * un tema sin efecto de casete o ningún tema. El efecto es el adorno; la música es el
   * pedido.
   *
   * Sin cadena no hay `volumenRocola` que rampar, así que el nivel lo pone el elemento.
   */
  const cadena = armarCadena(ctx, salida, medio);
  nodos = cadena;
  salidaDeLaCadena = cadena ? cadena.volumenRocola : null;
  if (!cadena) {
    try {
      medio.volume = GANANCIA_ROCOLA;
    } catch {
      /* un elemento sin `volume` suena a su nivel, que es mejor que no sonar */
    }
  }
  alRendirse = alRendirseFn ?? null;
  fallas = 0;
  puesta = true;
  ctxRocola = ctx;

  ponerProxima();
  return true;
}

/**
 * El elemento: fuera del documento **y** marcado.
 *
 * Las dos formas de `ADR-07.3` juntas, porque una sola falla en silencio. Ver el comentario
 * de cabecera del módulo.
 */
function crearElemento(): HTMLAudioElement | null {
  if (typeof Audio !== 'function') return null;
  try {
    const medio = new Audio();
    medio.preload = 'none';
    // La marca la pone la rocola y la lee la cinta. No hay una tercera forma: un elemento se
    // reconoce por lo que tiene, que es el mismo criterio que ya usa `medioDelEvento()`.
    medio.dataset.cinta = 'rocola';
    medio.addEventListener('ended', alTerminar);
    medio.addEventListener('error', fallo);
    return medio;
  } catch {
    return null;
  }
}

/**
 * Saca la rocola y no deja nada atrás: ni un temporizador, ni un nodo, ni una pieza sonando.
 *
 * **El elemento y su fuente no se sueltan**, y hay que decir por qué:
 * `createMediaElementSource()` tira la segunda vez sobre el mismo elemento, así que soltarlo
 * dejaría la rocola sin poder volver a prenderse en esta página. Se lo pausa y se le vacía el
 * `src`, que es lo que corta la descarga.
 */
export function apagarRocola(): void {
  cancelarDescanso();
  puesta = false;
  sonando = null;
  // El modo se apaga con el aparato: si la pieza fija sobreviviera al apagado, la rocola de
  // la pantalla siguiente arrancaría creyendo que no tiene que sortear.
  fija = null;
  alRendirse = null;
  if (nodos) {
    rampar(0, BAJADA_ROCOLA_SEG);
    try {
      nodos.bamboleo.stop();
    } catch {
      /* ya estaba frenado */
    }
    for (const n of [nodos.cuerpo, nodos.brillo, nodos.arrastreCinta, nodos.profundidadBamboleo, nodos.volumenRocola]) {
      try {
        n.disconnect();
      } catch {
        /* ya estaba suelto */
      }
    }
  }
  nodos = null;
  salidaDeLaCadena = null;
  ctxRocola = null;
  if (elemento) {
    try {
      elemento.pause();
      elemento.removeAttribute('src');
    } catch {
      /* un elemento que ya no está no hay que pausarlo */
    }
  }
  avisarPieza();
}

/**
 * Pasar a la que sigue. **Solo desde un gesto: mueve bytes.**
 *
 * Es el control "poné otro tema" de `UX-26`. No descansa ni espera el `ended`: el dedo ya
 * dijo que este no.
 *
 * **En `tema-fijo` no hace nada, y es lo correcto:** no hay otra pieza, así que lo único que
 * podría hacer es volver a empezar la misma — un control que dice "otro tema" y pone el
 * mismo. El interruptor tampoco lo ofrece ahí (`UX-26`), pero eso se decide en la isla y esto
 * es el módulo: dos candados sobre la misma puerta, como siempre.
 */
export function proximaPieza(): void {
  if (!puesta) return;
  if (fija) return;
  fallas = 0;
  ponerProxima();
}

/** Deja el módulo como recién cargado. **Solo para las pruebas.** */
export function reiniciarRocolaParaPruebas(): void {
  cancelarDescanso();
  piezas = [];
  puesta = false;
  fija = null;
  vuelta = [];
  sonando = null;
  ultimaQueSono = null;
  elemento = null;
  nodos = null;
  salidaDeLaCadena = null;
  ctxRocola = null;
  fallas = 0;
  alRendirse = null;
  fuenteCreada = false;
  oyentesDePieza.clear();
}

/** Solo para las pruebas: si la fuente ya se creó en esta sesión. */
export function fuenteYaCreadaParaPruebas(): boolean {
  return fuenteCreada;
}
