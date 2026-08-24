/**
 * El motor de audio del reveal (`US-02`, `CTR-01`).
 *
 * Corre **solo en el navegador**. Lo importa la isla `partida-tema.ts` y nada más.
 *
 * ## Por qué Web Audio y no una etiqueta `<audio>`
 *
 * El primer paso de la escalera dura **una décima de segundo**. Un `<audio>` no puede
 * arrancar y frenar con esa precisión: entre que se pide `play()` y suena algo puede
 * pasar más tiempo que el fragmento entero. Con un `AudioBuffer` ya decodificado en
 * memoria, arrancar cuesta lo mismo que programar un evento — y los seis pasos salen del
 * mismo buffer, así que **seis pasos cuestan lo mismo que uno** (`CTR-03.4`).
 *
 * Igual queda el repuesto: si el navegador no tiene Web Audio o la decodificación falla,
 * se cae a `<audio>` con un temporizador. En el paso 1 va a sonar impreciso — es lo que
 * hay — pero el juego no se cae. Degradar con dignidad antes que fallar en silencio.
 *
 * ## El primer toque tiene que ser instantáneo, y por eso el orden importa
 *
 * El pedido del usuario fue "que el botón de play sea fácil y rápido". Rápido no se
 * logra optimizando el botón: se logra **haciendo el trabajo antes de que lo aprieten**.
 *
 * 1. El botón "Empezar" de la portada llama a `despertar()`. Ese es el gesto que los
 *    celulares exigen para dejar sonar algo, y es el único momento garantizado en que
 *    tenemos uno antes de necesitar audio.
 * 2. Ahí mismo arranca la descarga y la decodificación del primer tema.
 * 3. Cuando el jugador aprieta "Escuchar", el buffer ya está: suena en el mismo cuadro.
 *
 * ## El presupuesto de memoria es de `CTR-01.5` y se respeta acá
 *
 * Como mucho **tres buffers** vivos a la vez: el que suena y los dos que vienen. Un
 * fragmento de 15 s decodificado a 44,1 kHz mono son ~2,6 MB de RAM, así que el techo
 * son ~8 MB — que es lo que un celular viejo puede sostener sin que lo maten. El pozo
 * puede tener 105 temas: eso no cambia un solo byte de esta cuenta.
 */

import { DURACION_FRAGMENTO_SEG } from './escalera.ts';

/** Dónde viven los fragmentos (`CTR-01.4`). */
export const CARPETA_FRAGMENTOS = '/audio/fragmentos';
/** Dónde viven los temas enteros (`D-23`, nivel 2). */
export const CARPETA_TEMAS = '/audio/temas';

/** Cuántos buffers decodificados se sostienen a la vez (`CTR-01.5`). */
const MAX_BUFFERS = 3;

export function urlDeFragmento(slug: string): string {
  return `${CARPETA_FRAGMENTOS}/${slug}.mp3`;
}

export function urlDeTema(slug: string): string {
  return `${CARPETA_TEMAS}/${slug}.mp3`;
}

type ConstructorDeContexto = new () => AudioContext;

export interface Escucha {
  /** Cuánto lleva sonando, en segundos. Se llama una vez por cuadro. */
  readonly alAvanzar?: (transcurrido: number) => void;
  /** Terminó de sonar (llegó al límite del paso o lo frenaron). */
  readonly alTerminar?: () => void;
}

export class Reproductor {
  private ctx: AudioContext | null = null;
  /** Buffers decodificados. Un `Map` conserva el orden de inserción: es la cola del LRU. */
  private readonly buffers = new Map<string, AudioBuffer>();
  /** Descargas en curso, para no pedir dos veces el mismo archivo. */
  private readonly enVuelo = new Map<string, Promise<void>>();
  private fuente: AudioBufferSourceNode | null = null;
  private repuesto: HTMLAudioElement | null = null;
  private cuadro = 0;
  private cortar = 0;

  /** `true` si este navegador no nos dio Web Audio y estamos con la etiqueta `<audio>`. */
  public get enRepuesto(): boolean {
    return this.ctx === null;
  }

  /**
   * Prepara el audio. **Tiene que llamarse desde adentro de un gesto del jugador.**
   *
   * Los celulares no dejan sonar nada que no haya pedido una persona. Llamar a esto en
   * el `click` de "Empezar" es lo que hace que el primer "Escuchar" no tenga que pelear
   * con esa política.
   */
  public despertar(): void {
    if (this.ctx) {
      // Volver de una pestaña en segundo plano deja el contexto suspendido.
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor = (window.AudioContext ??
      (window as unknown as { webkitAudioContext?: ConstructorDeContexto }).webkitAudioContext) as
      | ConstructorDeContexto
      | undefined;
    if (!Ctor) return; // sin Web Audio: queda el repuesto
    try {
      this.ctx = new Ctor();
      void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  /**
   * Descarga y decodifica un fragmento. Se puede llamar muchas veces: la segunda no
   * cuesta nada. Devuelve `false` si el archivo no está — el juego lo maneja, no explota.
   */
  public async precargar(slug: string): Promise<boolean> {
    if (this.buffers.has(slug)) return true;
    if (!this.ctx) return false; // en repuesto, `<audio>` descarga solo
    const yaVa = this.enVuelo.get(slug);
    if (yaVa) {
      await yaVa;
      return this.buffers.has(slug);
    }

    const tarea = (async () => {
      try {
        const resp = await fetch(urlDeFragmento(slug));
        if (!resp.ok) return;
        const crudo = await resp.arrayBuffer();
        const buffer = await this.ctx!.decodeAudioData(crudo);
        this.guardar(slug, buffer);
      } catch {
        // Un fragmento que no baja no rompe la partida: el motor cae al repuesto.
      } finally {
        this.enVuelo.delete(slug);
      }
    })();

    this.enVuelo.set(slug, tarea);
    await tarea;
    return this.buffers.has(slug);
  }

  /** Guarda respetando el techo de `CTR-01.5`: entra uno, sale el más viejo. */
  private guardar(slug: string, buffer: AudioBuffer): void {
    this.buffers.set(slug, buffer);
    while (this.buffers.size > MAX_BUFFERS) {
      const masViejo = this.buffers.keys().next().value;
      if (masViejo === undefined) break;
      this.buffers.delete(masViejo);
    }
  }

  /**
   * Suena `[0, segundos]` del fragmento.
   *
   * Siempre desde el arranque del archivo y nunca desde donde quedó: el reveal es
   * acumulativo, cada paso vuelve a contar la misma historia un poco más larga. Escuchar
   * "los siete segundos que faltaban" sueltos no es el mismo juego.
   */
  public sonar(slug: string, segundos: number, escucha: Escucha = {}): void {
    this.detener();
    const limite = Math.min(segundos, DURACION_FRAGMENTO_SEG);
    const buffer = this.buffers.get(slug);

    if (this.ctx && buffer) {
      // Renovar el buffer en la cola del LRU: el que suena es el último que se tira.
      this.buffers.delete(slug);
      this.buffers.set(slug, buffer);

      const fuente = this.ctx.createBufferSource();
      fuente.buffer = buffer;
      fuente.connect(this.ctx.destination);
      const arranque = this.ctx.currentTime;
      fuente.start(arranque, 0, limite);
      this.fuente = fuente;
      fuente.onended = () => {
        if (this.fuente === fuente) this.terminar(escucha);
      };
      this.seguir(() => this.ctx!.currentTime - arranque, limite, escucha);
      return;
    }

    this.sonarConRepuesto(slug, limite, escucha);
  }

  /**
   * El repuesto: etiqueta `<audio>` y un corte por temporizador.
   *
   * En el paso de 0,1 s esto es aproximado y no hay forma de que no lo sea. Se prefiere
   * un paso 1 impreciso a una pantalla muda.
   */
  private sonarConRepuesto(slug: string, limite: number, escucha: Escucha): void {
    const el = this.repuesto ?? new Audio();
    this.repuesto = el;
    if (!el.src.endsWith(`${slug}.mp3`)) el.src = urlDeFragmento(slug);
    el.currentTime = 0;
    const promesa = el.play();
    if (promesa) promesa.catch(() => this.terminar(escucha));
    this.cortar = window.setTimeout(() => {
      el.pause();
      this.terminar(escucha);
    }, limite * 1000);
    this.seguir(() => el.currentTime, limite, escucha);
  }

  /** El bucle de cuadros que mueve la barra mientras suena. */
  private seguir(transcurrido: () => number, limite: number, escucha: Escucha): void {
    if (!escucha.alAvanzar) return;
    const paso = (): void => {
      const t = transcurrido();
      escucha.alAvanzar!(Math.min(t, limite));
      if (t < limite) this.cuadro = requestAnimationFrame(paso);
    };
    this.cuadro = requestAnimationFrame(paso);
  }

  private terminar(escucha: Escucha): void {
    this.limpiar();
    escucha.alTerminar?.();
  }

  private limpiar(): void {
    if (this.cuadro) cancelAnimationFrame(this.cuadro);
    if (this.cortar) clearTimeout(this.cortar);
    this.cuadro = 0;
    this.cortar = 0;
    this.fuente = null;
  }

  /** Frena lo que esté sonando. Es seguro llamarlo siempre, suene o no. */
  public detener(): void {
    const fuente = this.fuente;
    this.limpiar();
    if (fuente) {
      fuente.onended = null;
      try {
        fuente.stop();
      } catch {
        // Ya había terminado solo: no es un error, es la carrera normal.
      }
    }
    this.repuesto?.pause();
  }
}
