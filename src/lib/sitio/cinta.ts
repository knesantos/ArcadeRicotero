/**
 * La cama de cinta: el aparato que corre abajo de todo (`ADR-04`).
 *
 * Ruido generado en memoria y filtrado hasta que deja de sonar a televisor sin señal y
 * empieza a sonar a cinta girando. **Cero archivos**: ni un mp3, ni un módulo de worklet,
 * ni una respuesta de impulso. Prendida o apagada, esta pieza transfiere **cero bytes**, y
 * esa es la mitad de por qué existe; la otra mitad es que adentro de un `Math.random()`
 * filtrado no hay obra de nadie, así que `D-14` no tiene por dónde agarrarla.
 *
 * ## Los cinco candados, para el que venga a aflojar uno
 *
 * 1. **Apagada por defecto.** La primera visita no oye nada. La preferencia se escribe
 *    recién cuando alguien la prende con el dedo.
 * 2. **Cero archivos.** Ver arriba.
 * 3. **Muda cuando algo suena.** Fragmento, tema entero, o lo que agregue un juego que
 *    todavía no existe. Se decide acá, en la capa de audio, **nunca en la pantalla de un
 *    juego**: `partida-tema.ts` no se entera de que esta pieza existe y no cambia una coma.
 * 4. **No lleva información.** Ningún estado del sitio se comunica con la cama. Apagarla
 *    no pierde nada, que es lo que la deja afuera de `prefers-reduced-motion` con la
 *    conciencia tranquila (`ADR-04.8`).
 * 5. **Un solo `AudioContext`**, el de `audio/contexto.ts`. El segundo contexto no es una
 *    alternativa peor: es la única forma de que la regla 3 no se pueda cumplir, porque un
 *    contexto no puede callar al otro.
 *
 * ## Por qué este archivo no importa casi nada
 *
 * Lo único que importa es `../audio/contexto.ts`, que a su vez no importa nada. La
 * dirección es única —`tema/audio.ts` → `audio/contexto.ts` ← `sitio/cinta.ts`— y si algún
 * día se cruzan, la convivencia pasa a depender de quién cargó primero, que es otra forma
 * de decir que deja de estar decidida. Y de paso cumple `D-29` por construcción: **lo que
 * nunca importa, nunca arrastra un `node:*` al teléfono de la gente.**
 *
 * ## Todo se mira adentro de la función, nunca al evaluarse el módulo
 *
 * `window`, `document` y `localStorage` se leen cuando alguien llama, no cuando el módulo
 * se carga. Mismo motivo que en `contexto.ts`: las pruebas instalan sus dobles después de
 * importar, y un módulo que se queda con lo que vio al nacer no se puede probar.
 */

import {
  alCambiarLaSalida,
  contextoVivo,
  despertarSalida,
  salidaOcupada,
} from '../audio/contexto.ts';
// La lista de las tres pantallas donde el sitio se saca la voz. Es un módulo hoja que no
// importa nada: si trajera algo de `arte.ts` arrastraría `node:fs` al navegador (`D-29`).
import { esPantallaGrave } from './graves.ts';

/**
 * El apagado de emergencia (`ADR-04.7`).
 *
 * Es un literal y no un valor calculado **para que se pueda encontrar con un `grep` y
 * cambiar sin entender el módulo**. En `false`: no se ofrece el interruptor, `prenderCinta()`
 * no crea un solo nodo, no se registra un solo escucha, y la preferencia guardada **se
 * ignora sin borrarse** — el día que se vuelva a prender, la persona que la tenía prendida
 * la sigue teniendo.
 */
export const CAMA_HABILITADA = true;

// ---------------------------------------------------------------------------------------
// Las constantes de `ADR-04.1`. Ningún número de audio se escribe dos veces en este repo:
// si un valor de acá aparece suelto en otro archivo, es un defecto aunque suene bien.
// Se exportan porque las pruebas las necesitan, y una prueba que reescriba el número lo
// escribiría dos veces.
// ---------------------------------------------------------------------------------------

/** El volumen de la cama. **Techo duro `0.08`** (`ADR-04.9`): no hay perilla, hay interruptor. */
export const GANANCIA_CAMA = 0.05;
/** Largo del bucle de ruido. **No pasa de `4`**: arriba de eso se rompe el presupuesto de RAM. */
export const LARGO_BUCLE_SEG = 3;
/** Lo que se cruza del final sobre el arranque al generar el bucle. Menos que esto y chasquea. */
export const CRUCE_SEG = 0.25;
/** El corte que saca el televisor. **Arriba de ~2500 vuelve la estática**: es el valor que más manda. */
export const SISEO_HZ = 1400;
/** Saca el barro de abajo, que si no tapa el arrastre. */
export const PISO_HZ = 120;
/** La rama que hace que algo esté girando. Sin ella la cama es aire, no un aparato. */
export const ARRASTRE_HZ = 70;
/** Cuánto de esa rama entra a la mezcla. */
export const NIVEL_ARRASTRE = 0.5;
/** El bamboleo lento del motor. **No puede ser múltiplo ni divisor de `LARGO_BUCLE_SEG`.** */
export const BAMBOLEO_HZ = 0.27;
/** Cuánto respira. Entra a `respiracion.gain`, jamás al maestro: ver `armar()`. */
export const PROFUNDIDAD_BAMBOLEO = 0.15;
/** El temblor rápido de la cinta contra la cabeza lectora. */
export const FLUTTER_HZ = 5.3;
/** Más profundidad que esto y suena a cinta rota, que es un chiste y no una atmósfera. */
export const PROFUNDIDAD_FLUTTER = 0.003;
/** Lo que tarda en callarse. **No sube**: el paso 1 del reveal dura 0,1 s (`D-26`). */
export const BAJADA_SEG = 0.02;
/** Lo que tarda en volver. Volver tiene que no notarse. */
export const SUBIDA_SEG = 1.2;
/** Desde que se libera la salida hasta que se la puede volver a oír (`ADR-04.3`). */
export const ESPERA_PARA_VOLVER_SEG = 6;

/*
 * Los tres `Q` del grafo. No están en la tabla de `ADR-04.1` pero sí en su dibujo, y valen
 * la misma regla: acá una vez, en ningún otro lado. Quedan sin exportar porque nadie afuera
 * tiene por qué mirarlos — son el ancho de cada campana, no una promesa del contrato.
 */
const Q_SISEO = 0.4;
const Q_PISO = 0.7;
const Q_ARRASTRE = 1.2;

/** La clave de `ADR-04.5`. `arcade.` es el espacio de nombres de todo el sitio (`D-16`). */
const CLAVE_PREFERENCIA = 'arcade.cinta';
const PRENDIDA = '1';
const APAGADA = '0';

/** Los cuatro estados, y ninguno más. El interruptor se pinta con esto (`UX-21`). */
export type EstadoCinta = 'apagada' | 'sonando' | 'callada' | 'bloqueada';

/** Los once nodos del grafo de `ADR-04.1`, vivos solo mientras la cama está prendida. */
interface Nodos {
  readonly fuente: AudioBufferSourceNode;
  readonly flutter: OscillatorNode;
  readonly profundidadFlutter: GainNode;
  readonly siseo: BiquadFilterNode;
  readonly piso: BiquadFilterNode;
  readonly arrastre: BiquadFilterNode;
  readonly nivelArrastre: GainNode;
  readonly bamboleo: OscillatorNode;
  readonly profundidadBamboleo: GainNode;
  readonly respiracion: GainNode;
  readonly volumenCama: GainNode;
}

let estado: EstadoCinta = 'apagada';
let nodos: Nodos | null = null;
/**
 * El bucle de ruido, generado una vez por página y conservado aunque se apague.
 *
 * Son ~144.000 llamadas a `Math.random()`: milisegundos, pero regenerarlo en cada toque del
 * interruptor sería trabajo por nada. **Nunca se genera si la cama está apagada**: primera
 * visita = 0 nodos, 0 MB, 0 bytes.
 */
let cintaRuido: AudioBuffer | null = null;
/**
 * La preferencia cuando `localStorage` no está disponible.
 *
 * Safari en privado y las ventanas incrustadas tiran al escribir. Que la cama rompa el
 * sitio por no poder guardar un `'1'` sería ridículo: se traga, y la preferencia vale por
 * lo que dure la página.
 */
let preferenciaEnMemoria: boolean | null = null;
/** El temporizador de `ESPERA_PARA_VOLVER_SEG`. Nunca hay dos. */
let espera: ReturnType<typeof setTimeout> | null = null;
/**
 * El encendido en curso, mientras `prenderCinta()` espera al `await`.
 *
 * Es una promesa y no un booleano a propósito: el segundo toque no solo tiene que **no**
 * armar una segunda cama, tiene que enterarse de cómo terminó la primera. Ver el comentario
 * de `prenderCinta()`.
 */
let armando: Promise<EstadoCinta> | null = null;
/**
 * La red contra la mudez permanente. Ver `armarRevision()`.
 */
let revision: ReturnType<typeof setTimeout> | null = null;
let bajaDeLaSalida: (() => void) | null = null;
let oidosPuestos = false;
/** El escucha del primer toque de la página, cuando la preferencia ya venía prendida. */
let toqueArmado: (() => void) | null = null;
const oyentes = new Set<(estado: EstadoCinta) => void>();
/**
 * Los medios del documento que están sonando ahora mismo (`ADR-04.3`, oído 2).
 *
 * Es un conjunto y no un contador por la misma razón que en `contexto.ts`: un entero con
 * `++` y `--` acumula deuda invisible, y el síntoma sería una cama que se quedó muda sin
 * que nadie pueda decir desde cuándo.
 */
const medios = new Set<HTMLMediaElement>();

/**
 * ¿Se puede ofrecer? Habilitada, con Web Audio, y en el navegador.
 *
 * No crea el contexto ni pregunta si suena: mirar no puede sonar. Preguntarle a
 * `contextoDeAudio()` sería construir un contexto fuera de un gesto, que es empezar a hacer
 * ruido sin que nadie lo haya pedido.
 */
export function cintaDisponible(): boolean {
  if (!CAMA_HABILITADA) return false;
  if (typeof window === 'undefined') return false;
  // El segundo candado sobre la misma puerta. El primero lo pone la isla, que no dibuja el
  // interruptor en estas tres pantallas; este está acá para que **la preferencia guardada
  // tampoco pueda prenderla**, la toque quien la toque y desde donde la toque.
  //
  // Salió de una revisión adversarial del ciclo 11, que preguntó lo que nadie había
  // preguntado: *"¿puede sonar en una pantalla donde sería una falta de respeto?"*. La
  // respuesta era que sí. Bulacio, Olavarría y la muerte del Indio son las tres pantallas
  // donde `voz-ricotera.md` §6 dice que el sitio se saca la voz, y `UX-20` §3.4 lo extiende
  // a la pantalla entera. Una cama de aire sonando ahí es exactamente eso.
  if (esPantallaGrave(window.location?.pathname ?? '')) return false;
  // Acá se **mira** el constructor, no se lo llama: el único `new` de todo el sitio está en
  // `audio/contexto.ts`. Vale la aclaración porque el `grep` de `ADR-04.10` —el que busca
  // `new AudioContext|webkitAudioContext|new Ctor()`— va a nombrar este archivo por esta
  // línea, y el que lo corra tiene que poder descartarlo en un segundo. Se mira el prefijado
  // además del bueno porque es el que `contexto.ts` sabe construir en los iOS viejos: si acá
  // se mirara solo el sin prefijo, el interruptor no se ofrecería en un teléfono donde la
  // cama sí puede sonar.
  const w = window as unknown as { AudioContext?: unknown; webkitAudioContext?: unknown };
  return typeof (w.AudioContext ?? w.webkitAudioContext) === 'function';
}

/** Qué está pasando ahora. Barato: no crea nada, no toca el contexto. */
export function estadoDeLaCinta(): EstadoCinta {
  return estado;
}

/**
 * Para que el interruptor se entere de `callada` y de `bloqueada`. Devuelve cómo darse de baja.
 *
 * `callada` es un estado visible a propósito: si la cama se calla sola y el interruptor
 * sigue diciendo prendida, la persona lo toca pensando que se rompió.
 */
export function alCambiarLaCinta(oyente: (estado: EstadoCinta) => void): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

function cambiarEstado(nuevo: EstadoCinta): void {
  if (estado === nuevo) return;
  estado = nuevo;
  // Sobre una copia y con `catch` por oyente: un interruptor que se da de baja mientras se
  // le avisa es normal, y un interruptor con un defecto no puede llevarse puesto al resto.
  for (const oyente of [...oyentes]) {
    try {
      oyente(nuevo);
    } catch {
      // El que escucha se arregla solo.
    }
  }
}

// ---------------------------------------------------------------------------------------
// La preferencia (`ADR-04.5`)
// ---------------------------------------------------------------------------------------

/**
 * Si la persona dejó la cinta prendida.
 *
 * **Cualquier cosa que no sea `'1'` es apagada**, incluida la ausencia: un valor corrupto no
 * es una preferencia. Y si `localStorage` tira al leer, tampoco lo es.
 */
function preferenciaGuardada(): boolean {
  if (preferenciaEnMemoria !== null) return preferenciaEnMemoria;
  try {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(CLAVE_PREFERENCIA) === PRENDIDA;
  } catch {
    return false;
  }
}

function guardarPreferencia(prendida: boolean): void {
  preferenciaEnMemoria = prendida;
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CLAVE_PREFERENCIA, prendida ? PRENDIDA : APAGADA);
  } catch {
    // Se traga y se sigue: la memoria de arriba ya se acordó por lo que dure la página.
  }
}

// ---------------------------------------------------------------------------------------
// El grafo (`ADR-04.1`)
// ---------------------------------------------------------------------------------------

/**
 * El bucle de ruido, con los últimos `CRUCE_SEG` cruzados sobre el arranque.
 *
 * **El cruce es de potencia constante, no lineal, y esa es la diferencia entre que se oiga
 * y que no.** Las dos puntas que se mezclan son ruido sin relación entre sí: con pesos
 * lineales, la energía de la suma cae hasta ~3 dB en el medio del cruce y aparece un bache
 * que da la vuelta cada tres segundos — o sea, un patrón audible, que es justo lo que esta
 * pieza no puede tener. Con seno y coseno la suma de los cuadrados da uno y el nivel no se
 * mueve.
 */
function generarCintaRuido(ctx: AudioContext): AudioBuffer {
  const muestras = Math.floor(LARGO_BUCLE_SEG * ctx.sampleRate);
  const cruce = Math.min(Math.floor(CRUCE_SEG * ctx.sampleRate), Math.floor(muestras / 2));
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
  for (let i = 0; i < cruce; i++) {
    const t = (i + 1) / (cruce + 1);
    const j = muestras - cruce + i;
    datos[j] = datos[j] * Math.cos((t * Math.PI) / 2) + datos[i] * Math.sin((t * Math.PI) / 2);
  }
  return buffer;
}

/**
 * Arma los once nodos y los arranca. Devuelve `null` si algo tiró.
 *
 * **Los dos detalles que separan esto de una estática con el volumen bajo:**
 *
 * - **`siseo` a 1400 Hz es lo que saca el televisor.** El ruido blanco crudo tiene energía
 *   plana hasta arriba, y eso *es* el sonido de una pantalla sin señal. Doce decibeles por
 *   octava para arriba de ahí y pasa a ser cinta.
 * - **`arrastre` es la mitad del truco y la que nadie pone.** Es la misma fuente filtrada a
 *   70 Hz: no se escucha como sonido, se escucha como que algo está girando.
 *
 * Y el que no es un detalle sino una regla: **el bamboleo entra a `respiracion.gain` y
 * nunca al maestro.** Una entrada conectada a un `AudioParam` **se suma** al valor de la
 * automatización, así que con el maestro en cero el oscilador seguiría sumando ±0,15 y
 * *"callada" no sería silencio*. Por eso hay dos gains: `respiracion` respira, `volumenCama`
 * manda, y el maestro en 0 es cero absoluto.
 */
function armar(ctx: AudioContext): Nodos | null {
  const creados: Array<{ disconnect: () => void }> = [];
  const anotar = <T extends { disconnect: () => void }>(nodo: T): T => {
    creados.push(nodo);
    return nodo;
  };
  try {
    if (!cintaRuido) cintaRuido = generarCintaRuido(ctx);

    const fuente = anotar(ctx.createBufferSource());
    fuente.buffer = cintaRuido;
    fuente.loop = true;

    const siseo = anotar(ctx.createBiquadFilter());
    siseo.type = 'lowpass';
    siseo.frequency.value = SISEO_HZ;
    siseo.Q.value = Q_SISEO;

    const piso = anotar(ctx.createBiquadFilter());
    piso.type = 'highpass';
    piso.frequency.value = PISO_HZ;
    piso.Q.value = Q_PISO;

    const arrastre = anotar(ctx.createBiquadFilter());
    arrastre.type = 'lowpass';
    arrastre.frequency.value = ARRASTRE_HZ;
    arrastre.Q.value = Q_ARRASTRE;

    const nivelArrastre = anotar(ctx.createGain());
    nivelArrastre.gain.value = NIVEL_ARRASTRE;

    const respiracion = anotar(ctx.createGain());
    respiracion.gain.value = 1;

    const volumenCama = anotar(ctx.createGain());
    // Arranca en cero y sube con rampa. Es el único nodo que se rampa en todo el módulo.
    volumenCama.gain.value = 0;

    const bamboleo = anotar(ctx.createOscillator());
    bamboleo.type = 'sine';
    bamboleo.frequency.value = BAMBOLEO_HZ;
    const profundidadBamboleo = anotar(ctx.createGain());
    profundidadBamboleo.gain.value = PROFUNDIDAD_BAMBOLEO;

    const flutter = anotar(ctx.createOscillator());
    flutter.type = 'sine';
    flutter.frequency.value = FLUTTER_HZ;
    const profundidadFlutter = anotar(ctx.createGain());
    profundidadFlutter.gain.value = PROFUNDIDAD_FLUTTER;

    fuente.connect(siseo);
    siseo.connect(piso);
    piso.connect(respiracion);

    fuente.connect(arrastre);
    arrastre.connect(nivelArrastre);
    nivelArrastre.connect(respiracion);

    flutter.connect(profundidadFlutter);
    profundidadFlutter.connect(fuente.playbackRate);

    bamboleo.connect(profundidadBamboleo);
    profundidadBamboleo.connect(respiracion.gain);

    respiracion.connect(volumenCama);
    volumenCama.connect(ctx.destination);

    fuente.start();
    bamboleo.start();
    flutter.start();

    return {
      fuente,
      flutter,
      profundidadFlutter,
      siseo,
      piso,
      arrastre,
      nivelArrastre,
      bamboleo,
      profundidadBamboleo,
      respiracion,
      volumenCama,
    };
  } catch {
    // Un grafo a medio armar es peor que ninguno: se suelta entero y quien llamó se
    // declara `bloqueada`. No hay reintento.
    soltar(creados);
    return null;
  }
}

function soltar(nodosSueltos: Array<{ disconnect: () => void }>): void {
  for (const nodo of nodosSueltos) {
    try {
      nodo.disconnect();
    } catch {
      // Ya estaba desconectado: no es un error, es la carrera normal.
    }
  }
}

/**
 * Baja el volumen y desarma el grafo **sin un solo temporizador de JavaScript**.
 *
 * Las fuentes se frenan en el reloj del audio (`stop(t)`), no con un `setTimeout` que
 * habría que acordarse de limpiar; y la desconexión cuelga del `onended` de la fuente, que
 * dispara cuando ese `stop` se hace efectivo. Es un evento, no una encuesta: `ADR-04.10`
 * prohíbe las dos formas de mirar el reloj y esta no es ninguna.
 */
function desarmar(): void {
  const grafo = nodos;
  nodos = null;
  if (!grafo) return;
  const ctx = contextoVivo();
  const todos = [
    grafo.fuente,
    grafo.flutter,
    grafo.profundidadFlutter,
    grafo.siseo,
    grafo.piso,
    grafo.arrastre,
    grafo.nivelArrastre,
    grafo.bamboleo,
    grafo.profundidadBamboleo,
    grafo.respiracion,
    grafo.volumenCama,
  ];
  try {
    const fin = (ctx ? ctx.currentTime : 0) + BAJADA_SEG;
    grafo.fuente.onended = () => soltar(todos);
    grafo.fuente.stop(fin);
    grafo.bamboleo.stop(fin);
    grafo.flutter.stop(fin);
  } catch {
    // Si no se puede programar el freno, se suelta ahora: silencio con un chasquido es
    // mejor que una cama que quedó sonando sin dueño.
    soltar(todos);
  }
}

/**
 * Programa el volumen maestro. Es el único lugar del módulo que toca un `AudioParam`.
 *
 * El valor de partida se **lee antes de cancelar**: `cancelScheduledValues()` borra lo que
 * viene, y sin fijar dónde estamos ahora la rampa saldría desde el último valor programado
 * —que puede ser de hace un rato— y se oiría como un salto en vez de una bajada.
 */
function rampar(destino: number, segundos: number): void {
  const parametro = nodos?.volumenCama.gain;
  const ctx = contextoVivo();
  if (!parametro || !ctx) return;
  try {
    const actual = parametro.value;
    const ahora = ctx.currentTime;
    parametro.cancelScheduledValues(ahora);
    parametro.setValueAtTime(actual, ahora);
    parametro.linearRampToValueAtTime(destino, ahora + segundos);
  } catch {
    // Se deja donde está a propósito: `ADR-04.10` prohíbe cortar a cero seco, y un
    // chasquido se oye peor que un siseo de más. El próximo evento vuelve a intentar.
  }
}

// ---------------------------------------------------------------------------------------
// La convivencia (`ADR-04.3`): dos oídos, ninguno en la pantalla de un juego
// ---------------------------------------------------------------------------------------

/**
 * Saca del conjunto lo que ya no está sonando aunque nadie lo haya avisado.
 *
 * **Sin este barrido, un `<audio>` que la pantalla borra mientras suena —el juego reemplaza
 * la pantalla al seguir— deja la cama muda para siempre, y nadie sabría por qué.** Al
 * elemento que se va del documento no le dispara `pause` nadie.
 */
function barrer(): void {
  for (const medio of [...medios]) {
    if (medio.paused || medio.ended || !medio.isConnected) medios.delete(medio);
  }
}

/**
 * Las cuatro razones por las que la cama se tiene que callar, en un solo lugar.
 *
 * La tercera y la cuarta son las preferencias 2 y 3 de `ADR-04.8`: la página escondida
 * —otra pestaña, otra aplicación, el teléfono en el bolsillo— y el contexto que el sistema
 * se llevó por una llamada o por Siri. **Contra ninguna de las dos se pelea:** no se llama
 * a `resume()` fuera de un gesto y no se reintenta.
 */
function debeCallarse(): boolean {
  barrer();
  if (medios.size > 0) return true;
  if (salidaOcupada()) return true;
  if (typeof document !== 'undefined' && document.hidden) return true;
  const ctx = contextoVivo();
  return ctx !== null && ctx.state !== 'running';
}

/**
 * Vuelve a preguntarse si le toca sonar. Corre **adentro del evento que despertó la
 * pregunta**: no hay `setInterval`, no hay `requestAnimationFrame`, no hay `Analyser`.
 */
/**
 * La red contra la mudez permanente, y es la única espera de este módulo que nadie pidió.
 *
 * `ADR-04.3` prohíbe la encuesta y tiene razón: no hay `setInterval`, ni cuadros, ni
 * `Analyser`. Pero el barrido del conjunto de medios **solo corre adentro de un evento**, y
 * hay un caso sin evento: un medio que la pantalla saca del documento y el navegador frena
 * sin avisar. Si eso pasa, la cama se queda muda **para siempre** y nadie puede decir desde
 * cuándo. Lo encontró una refutación adversarial del ciclo 11.
 *
 * Esto no es una encuesta: es **un solo temporizador, armado únicamente mientras la cama
 * está callada por un medio**, que vuelve a preguntar una vez y se rearma solo si sigue
 * habiendo motivo. Con la cama sonando, apagada o callada por otra razón, no existe. El
 * peor caso pasa de "muda para siempre" a "muda seis segundos de más".
 *
 * **Es un desvío declarado de `ADR-04.3`** y está anotado en
 * `Docs/SUGERENCIAS/HILO-para-arquitectura-la-red-de-la-cinta.md`.
 */
function armarRevision(): void {
  if (revision !== null) return;
  revision = setTimeout(() => {
    revision = null;
    mirarDeNuevo();
  }, ESPERA_PARA_VOLVER_SEG * 1000);
}

function cancelarRevision(): void {
  if (revision === null) return;
  clearTimeout(revision);
  revision = null;
}

function reevaluar(): void {
  if (estado !== 'sonando' && estado !== 'callada') return;
  if (debeCallarse()) {
    cancelarEspera();
    // Solo por un medio: las otras tres razones —la salida tomada, la página escondida, el
    // contexto interrumpido— tienen su propio evento y no necesitan red.
    if (medios.size > 0) armarRevision();
    if (estado === 'callada') return;
    // Veinte milisegundos, y no es un gusto: el paso 1 del reveal dura 0,1 s (`D-26`), así
    // que la cama tiene que estar abajo antes del primer quinto del escalón que `CTR-01.5`
    // existe para que suene honesto.
    rampar(0, BAJADA_SEG);
    cambiarEstado('callada');
    return;
  }
  if (estado === 'sonando' || espera !== null) return;
  // Seis segundos antes de volver: los escalones y el tipeo del buscador llegan en ráfagas,
  // y una cama que entra y sale entre toque y toque se nota **más** que no tenerla.
  espera = setTimeout(volver, ESPERA_PARA_VOLVER_SEG * 1000);
}

function volver(): void {
  espera = null;
  cancelarRevision();
  if (estado !== 'callada' || debeCallarse()) return;
  rampar(GANANCIA_CAMA, SUBIDA_SEG);
  cambiarEstado('sonando');
}

function cancelarEspera(): void {
  if (espera === null) return;
  clearTimeout(espera);
  espera = null;
}

/**
 * El medio que disparó el evento, o `null` si el evento no era de un medio.
 *
 * Se lo reconoce por lo que tiene y no con `instanceof HTMLMediaElement` a propósito: un
 * elemento que viene de otro documento —un `<iframe>`, una plantilla adoptada— no es
 * `instanceof` de la clase de *esta* ventana, y sin embargo suena igual de fuerte.
 */
function medioDelEvento(evento: Event): HTMLMediaElement | null {
  const blanco = evento.target as unknown as { paused?: unknown } | null;
  if (!blanco || typeof blanco.paused !== 'boolean') return null;
  return blanco as HTMLMediaElement;
}

function anotarMedio(evento: Event): void {
  const medio = medioDelEvento(evento);
  if (!medio) return;
  medios.add(medio);
  reevaluar();
}

function soltarMedio(evento: Event): void {
  const medio = medioDelEvento(evento);
  if (medio) medios.delete(medio);
  reevaluar();
}

/** Para `visibilitychange` y para el `statechange` del contexto: la misma pregunta. */
function mirarDeNuevo(): void {
  reevaluar();
}

/**
 * Los dos oídos, que se registran solo mientras la cama está prendida.
 *
 * - **Oído 1, el token de la salida.** Cubre el motor de fragmentos por sus **dos** caminos,
 *   incluido el de repuesto, que sale por un `<audio>` que nunca entra al documento y que
 *   por eso no lo vería ni un `Analyser` colgado del grafo ni un escucha de la página.
 * - **Oído 2, los eventos del documento en fase de captura.** `true` no es opcional: **los
 *   eventos de medios no burbujean**, así que sin captura un `<audio>` que suena tres
 *   niveles más abajo no llega nunca hasta acá. Cubre el reproductor del tema entero sin
 *   que la isla lo sepa, y cubre cualquier medio que agregue un juego futuro **sin escribir
 *   una línea**. Es la parte que hace que esta regla no envejezca.
 */
function registrarOidos(): void {
  if (oidosPuestos) return;
  oidosPuestos = true;
  bajaDeLaSalida = alCambiarLaSalida(mirarDeNuevo);
  if (typeof document !== 'undefined') {
    /*
     * **Lo que ya estaba sonando antes de que llegáramos.**
     *
     * Los escuchas solo traen eventos futuros, así que una cama prendida en el medio de un
     * tema que ya sonaba nacía **encima** de él: el conjunto estaba vacío, `debeCallarse()`
     * decía que no, y la cama arrancaba pisando. Pasa de verdad en dos caminos: prender la
     * cinta con el reproductor del tema entero ya andando, y volver a prenderla después de
     * apagarla mientras algo sonaba, porque apagar vacía el conjunto.
     *
     * Un barrido del documento al registrar lo cierra. Corre **una vez por encendido**, no
     * es una encuesta, y si `querySelectorAll` no existe —los dobles de las pruebas— no
     * pasa nada. Lo encontró una refutación adversarial del ciclo 11.
     */
    try {
      const encontrados = document.querySelectorAll?.('audio, video');
      for (const medio of encontrados ?? []) {
        const m = medio as HTMLMediaElement;
        if (!m.paused && !m.ended) medios.add(m);
      }
    } catch {
      /* un documento sin `querySelectorAll` no tiene medios que encontrar */
    }
    document.addEventListener('play', anotarMedio, true);
    document.addEventListener('playing', anotarMedio, true);
    document.addEventListener('pause', soltarMedio, true);
    document.addEventListener('ended', soltarMedio, true);
    document.addEventListener('visibilitychange', mirarDeNuevo);
  }
  const ctx = contextoVivo();
  if (ctx && typeof ctx.addEventListener === 'function') {
    ctx.addEventListener('statechange', mirarDeNuevo);
  }
}

function desregistrarOidos(): void {
  if (!oidosPuestos) return;
  oidosPuestos = false;
  bajaDeLaSalida?.();
  bajaDeLaSalida = null;
  if (typeof document !== 'undefined') {
    document.removeEventListener('play', anotarMedio, true);
    document.removeEventListener('playing', anotarMedio, true);
    document.removeEventListener('pause', soltarMedio, true);
    document.removeEventListener('ended', soltarMedio, true);
    document.removeEventListener('visibilitychange', mirarDeNuevo);
  }
  const ctx = contextoVivo();
  if (ctx && typeof ctx.removeEventListener === 'function') {
    ctx.removeEventListener('statechange', mirarDeNuevo);
  }
  medios.clear();
}

// ---------------------------------------------------------------------------------------
// El interruptor
// ---------------------------------------------------------------------------------------

/**
 * Prende la cama. **Solo desde adentro de un gesto de la persona.**
 *
 * El interruptor **es** el gesto que la política de autoreproducción exige, y no hay ningún
 * otro: la cama no se prende en ningún otro lado. Si igual queda trabada —pasa de verdad en
 * las ventanas incrustadas de WhatsApp, Instagram o TikTok, que recortan el audio de
 * maneras que el navegador de verdad no—, entonces:
 *
 * - **un intento y nada más**: no se reintenta, no se encuesta, y no queda armado un escucha
 *   del próximo toque, que es exactamente el truco que esa política existe para impedir;
 * - **la preferencia no se guarda**: nunca se recuerda algo que no llegó a pasar;
 * - **cero nodos vivos**, y el estado queda en `bloqueada` para que el interruptor lo diga.
 */
export async function prenderCinta(): Promise<EstadoCinta> {
  if (!cintaDisponible()) {
    cambiarEstado('apagada');
    return estado;
  }
  // El segundo toque sobre una cama ya armada no arma un segundo grafo: sería una cama
  // encima de la otra, al doble de volumen y sin forma de apagar la de abajo.
  //
  // **Y el candado tiene que estar de los DOS lados del `await`, no solo antes.** `nodos`
  // se asigna recién después de la suspensión, así que dos llamadas que se pisen —el dedo
  // que rebota, el rearme del primer toque llegando junto con el toque sobre el propio
  // interruptor— pasaban las dos por acá con `nodos` todavía en `null` y armaban dos camas.
  // La segunda pisaba la referencia de la primera, que quedaba sonando sin apagador.
  // Lo encontró una refutación adversarial del ciclo 11, no una prueba: la prueba miraba
  // el segundo toque **después** de que el primero terminara, que es el caso fácil.
  if (nodos) return estado;
  // Y el segundo toque **espera al primero** en vez de irse con un estado viejo: si
  // devolviera `estado` sin más, el interruptor se pintaría `APAGADA` mientras la cama se
  // está prendiendo, que es mentirle a quien acaba de tocar.
  if (armando) return armando;

  armando = armarYSonar().finally(() => {
    armando = null;
  });
  return armando;
}

/** La segunda mitad de `prenderCinta()`, separada solo para que el candado la envuelva. */
async function armarYSonar(): Promise<EstadoCinta> {
  const salida = await despertarSalida();
  const ctx = contextoVivo();
  if (salida !== 'running' || !ctx) {
    cambiarEstado('bloqueada');
    return estado;
  }

  nodos = armar(ctx);
  if (!nodos) {
    cambiarEstado('bloqueada');
    return estado;
  }

  registrarOidos();
  guardarPreferencia(true);
  if (debeCallarse()) {
    // Prendida mientras algo suena: nace muda y espera su turno, sin pisar nada.
    cambiarEstado('callada');
  } else {
    rampar(GANANCIA_CAMA, SUBIDA_SEG);
    cambiarEstado('sonando');
  }
  return estado;
}

/**
 * Apaga la cama y no deja nada atrás: ni un escucha, ni un temporizador, ni un nodo.
 *
 * El orden importa. Primero se sueltan los escuchas —si no, el desarme podría despertar una
 * reevaluación sobre un grafo que ya no está— y recién después se baja el volumen, que es
 * lo único que tarda: `BAJADA_SEG` en el reloj del audio, sin temporizador de por medio.
 */
export function apagarCinta(): void {
  cancelarEspera();
  cancelarRevision();
  desarmarRearme();
  desregistrarOidos();
  if (nodos) {
    rampar(0, BAJADA_SEG);
    desarmar();
  }
  guardarPreferencia(false);
  cambiarEstado('apagada');
}

/**
 * Deja lista la cinta para el primer toque de la página, si la persona la había prendido.
 *
 * **La cama no construye nada al cargar** (`ADR-04.4`): cada documento es un contexto nuevo
 * y ningún navegador deja sonar nada sin un gesto. Así que la preferencia guardada no
 * prende nada por sí sola — arma un escucha de **un solo uso** y espera el primer toque o la
 * primera tecla de la página.
 *
 * **Esto no es autoreproducción**: la persona ya declaró con el dedo que quiere la cinta, y
 * esto es lo mínimo para que esa declaración signifique algo cuando se cambia de pantalla.
 * Con `ADR-03` el tránsito es entre documentos, así que corre una vez por página.
 *
 * Devuelve cómo desarmarlo. Si la preferencia está apagada, no registra nada.
 */
export function rearmarCinta(): () => void {
  desarmarRearme();
  if (!cintaDisponible() || !preferenciaGuardada() || typeof document === 'undefined') {
    return desarmarRearme;
  }
  const alPrimerToque = (): void => {
    desarmarRearme();
    void prenderCinta();
  };
  toqueArmado = alPrimerToque;
  document.addEventListener('pointerdown', alPrimerToque, { once: true, capture: true });
  document.addEventListener('keydown', alPrimerToque, { once: true, capture: true });
  return desarmarRearme;
}

function desarmarRearme(): void {
  const armado = toqueArmado;
  toqueArmado = null;
  if (!armado || typeof document === 'undefined') return;
  document.removeEventListener('pointerdown', armado, true);
  document.removeEventListener('keydown', armado, true);
}

/**
 * Deja el módulo como recién cargado. **Solo para las pruebas.**
 *
 * Mismo motivo que `reiniciarAudioParaPruebas()` en `contexto.ts`: el bucle de ruido, el
 * estado y los escuchas viven en el ámbito del módulo, así que sin esto el caso siguiente
 * mide lo que dejó el anterior —y lo peor es que lo mediría bien un rato—. Además suelta el
 * temporizador de la espera, que si no deja el proceso de las pruebas esperándolo.
 */
export function reiniciarCintaParaPruebas(): void {
  cancelarEspera();
  cancelarRevision();
  desarmarRearme();
  desregistrarOidos();
  nodos = null;
  cintaRuido = null;
  preferenciaEnMemoria = null;
  estado = 'apagada';
  oyentes.clear();
}
