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
import { contextoDeAudio, tomarLaSalida } from '../audio/contexto.ts';

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
  /**
   * Qué vuelta de reproducción está vigente.
   *
   * Sube en cada `limpiar()`, o sea cada vez que se deja de sonar por cualquier puerta. Lo
   * mira la promesa de `resume()` antes de arrancar: si la vuelta cambió mientras esperaba,
   * es porque alguien frenó, y frenar quiere decir frenar.
   */
  private vuelta = 0;
  private cortar = 0;
  /** Si ya sono el buffer mudo que destraba el audio en los celulares. */
  private desbloqueado = false;
  /**
   * Como soltar la salida mientras suena un fragmento (`ADR-04.3`).
   *
   * El motor no sabe quien escucha esto y no lo tiene que saber: avisa que la salida esta
   * ocupada y sigue con lo suyo. La cama de cinta es la que se calla; si manana hay otra
   * cosa, se calla tambien sin que este archivo cambie.
   */
  private soltarSalida: (() => void) | null = null;
  /** El tema que se esta jugando: nunca lo desaloja el LRU. */
  private enJuego: string | null = null;
  /** El ultimo error que se trago un `catch`, para que el diagnostico lo pueda mostrar. */
  public ultimoError: string | null = null;

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
    if (!this.ctx) {
      /*
       * **El contexto ya no lo construye este motor: se lo pide prestado** (`ADR-04.2`).
       *
       * Uno solo para todo el sitio. No es prolijidad: dos contextos no pueden callarse
       * entre ellos, y la cama de cinta tiene que quedarse muda justo cuando este motor
       * suena. Encima, este ciclo de vida —nace `suspended` en el celular, cae en
       * `interrupted` cuando entra una llamada— costó dos defectos aprenderlo, y no se
       * escribe dos veces.
       *
       * De acá para abajo no cambió una coma: el `resume()` con su `.catch` y el
       * `desbloquear()` son la parte que arregló el celular del usuario.
       */
      this.ctx = contextoDeAudio();
      if (!this.ctx) return; // sin Web Audio: queda el repuesto
    }
    // Volver de una pestaña en segundo plano, o de una llamada, deja el contexto parado.
    //
    // El `.catch` no es prolijidad: un navegador que rechaza el `resume` dejaba una
    // promesa sin capturar, y eso es ruido en la consola de la gente por algo que el
    // motor ya sabe manejar — cuando toque "Escuchá" se vuelve a intentar, y si tampoco
    // sale, cae al repuesto.
    if (this.ctx.state !== 'running') void this.ctx.resume().catch(() => {});
    this.desbloquear();
  }

  /**
   * El desbloqueo de los celulares, que **no es lo mismo que `resume()`**.
   *
   * En iOS un `AudioContext` recién creado nace `suspended`, y hay versiones donde
   * `resume()` solo no alcanza: el contexto queda listo recién cuando **sonó algo** desde
   * adentro de un gesto de la persona. Un buffer de una muestra en silencio es ese algo —
   * no se oye, no molesta, y deja el motor destrabado para el primer "Escuchá".
   *
   * Se hace una sola vez. Si el navegador lo rechaza, no pasa nada: el camino de repuesto
   * con `<audio>` sigue estando.
   */
  private desbloquear(): void {
    if (!this.ctx || this.desbloqueado) return;
    try {
      const mudo = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      const fuente = this.ctx.createBufferSource();
      fuente.buffer = mudo;
      fuente.connect(this.ctx.destination);
      fuente.start(0);
      this.desbloqueado = true;
    } catch {
      // Un navegador que no deja ni esto va a caer al repuesto igual.
    }
    // El `<audio>` de repuesto también se crea acá, adentro del gesto: en iOS un elemento
    // creado fuera de un gesto no puede reproducir después por más que se lo pida.
    if (!this.repuesto) {
      try {
        this.repuesto = new Audio();
        this.repuesto.preload = 'auto';
      } catch {
        this.repuesto = null;
      }
    }
  }

  /**
   * Descarga y decodifica un fragmento. Se puede llamar muchas veces: la segunda no
   * cuesta nada. Devuelve `false` si el archivo no está — el juego lo maneja, no explota.
   */
  public async precargar(slug: string): Promise<boolean> {
    const yaEsta = this.buffers.get(slug);
    if (yaEsta) {
      /*
       * **Refrescar el orden acá era lo que faltaba, y era un defecto de verdad.**
       *
       * El `Map` es la cola del LRU: el primero en salir es el primero que entró. Al
       * volver temprano sin tocar el orden, un tema que se acababa de pedir quedaba
       * marcado como el más viejo — y el desalojo se lo llevaba puesto.
       *
       * Simulado con la ronda real de cuatro temas, `MAX_BUFFERS = 3` y una ventana de
       * precarga de 2: al arrancar el tema 2, precargar el tema 4 dispara el desalojo, y
       * el que sale es **el buffer del tema 2, el que estaba por sonar**. Caía al repuesto
       * `<audio>`, que en los primeros pasos es mudo por construcción (ver
       * `sonarConRepuesto`). O sea: el segundo tema de cada vuelta no sonaba.
       */
      this.buffers.delete(slug);
      this.buffers.set(slug, yaEsta);
      return true;
    }
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
      } catch (e) {
        // Un fragmento que no baja no rompe la partida: el motor cae al repuesto. Pero
        // el error se guarda: era el unico dato que nadie podia ver desde afuera, y sin
        // el no hay forma de distinguir "no bajo" de "no se pudo decodificar".
        this.ultimoError = `${slug}: ${String(e)}`;
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
      // El tema en juego **nunca** se desaloja, ni siquiera si quedó al fondo de la cola.
      // Es el cinturón sobre el arreglo del orden: aunque alguien vuelva a introducir el
      // defecto de arriba, el buffer que hace falta ahora mismo no se puede tirar.
      const candidato = [...this.buffers.keys()].find((k) => k !== this.enJuego);
      if (candidato === undefined) break;
      this.buffers.delete(candidato);
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

    /*
     * **El destrabe va primero, y siempre — haya buffer o no.**
     *
     * Estamos adentro del clic en "Escuchá", que es un gesto: el único momento en que el
     * navegador acepta destrabar el audio. Hacerlo acá, y no solo en "Empezá", es lo que
     * arregla el celular. Y hacerlo **antes** de mirar el buffer arregla el segundo caso,
     * que apareció escribiendo la prueba: si el fragmento todavía se está bajando —muy
     * probable en un teléfono con datos— el camino viejo se iba derecho al repuesto y
     * dejaba el contexto parado **para el resto de la partida**, así que los toques
     * siguientes tampoco sonaban aunque el buffer ya estuviera.
     */
    this.desbloquear();

    /*
     * **El aviso de que la salida está ocupada** (`ADR-04.3`, oído 1).
     *
     * Va acá arriba, pegado al destrabe, y no más adentro: de esta línea para abajo el
     * motor se bifurca en dos caminos y el de repuesto sale por un `<audio>` que nunca
     * entra al documento, así que nadie que mire el grafo de Web Audio o los eventos de la
     * página lo vería sonar. El aviso no pregunta por dónde sale el sonido: dice que el
     * motor está sonando, que es lo único que hace falta saber.
     *
     * El tope copia el que este archivo ya tenía para el repuesto, `limite + 5`: un aviso
     * que se filtra dejaría la atmósfera muda para siempre y sin síntoma. Se suelta solo.
     */
    this.soltarSalida = tomarLaSalida('fragmento', limite + 5);

    /*
     * **El chequeo de estado, que faltaba, y era el defecto que reportó el usuario.**
     *
     * Si el contexto no está `running`, `fuente.start()` programa contra un reloj que no
     * avanza: **no suena nada, `onended` nunca dispara**, el botón queda trabado en
     * "Parar" y la barra no se mueve. En escritorio no pasaba porque ahí el contexto nace
     * corriendo; en el celular nace `suspended`, y Safari además tiene un estado propio,
     * `interrupted`, en el que cae después de una llamada o de Siri.
     */
    if (this.ctx && this.ctx.state !== 'running') {
      /*
       * **La vuelta que se toma antes de irse a esperar, y por qué hace falta.**
       *
       * Entre este `resume()` y su promesa hay un hueco, y en ese hueco entra el dedo: se
       * toca "Escuchar" con el contexto dormido y se toca "Parar" antes de que Safari
       * conteste. Sin esta marca, cuando la promesa resolvía **el fragmento arrancaba
       * igual**, después de que la persona lo frenó.
       *
       * Ese defecto ya estaba antes del ciclo 11 y era solo molesto. Con el token de la
       * salida (`ADR-04.3`) pasó a ser peor: `detener()` ya soltó la salida, así que ese
       * sonido huérfano suena **con la salida declarada libre** y la cama de cinta vuelve a
       * subir a los seis segundos, encima de un fragmento de quince. Es exactamente lo que
       * el oído 1 existe para impedir, y sin ningún síntoma para el que escucha.
       *
       * Lo encontró una refutación adversarial del ciclo 11 corriendo la carrera, no un
       * test. La ventana es angosta en escritorio y ancha volviendo de una llamada, que es
       * justo cuando aparece `interrupted`.
       */
      const vuelta = ++this.vuelta;
      const sigueVigente = (): boolean => vuelta === this.vuelta;
      void this.ctx.resume().then(
        () => {
          if (sigueVigente()) this.reproducir(slug, limite, escucha);
        },
        // Si ni resumiendo arranca, mejor el `<audio>` impreciso que el silencio.
        () => {
          if (sigueVigente()) this.sonarConRepuesto(slug, limite, escucha);
        },
      );
      return;
    }

    this.reproducir(slug, limite, escucha);
  }

  /** Elige el camino según lo que hay: buffer con contexto vivo, o el repuesto. */
  private reproducir(slug: string, limite: number, escucha: Escucha): void {
    this.enJuego = slug;
    const buffer = this.buffers.get(slug);
    if (this.ctx && this.ctx.state === 'running' && buffer) {
      this.sonarConBuffer(slug, buffer, limite, escucha);
      return;
    }
    this.sonarConRepuesto(slug, limite, escucha);
  }

  /** El camino bueno: el buffer ya decodificado, con el contexto corriendo. */
  private sonarConBuffer(slug: string, buffer: AudioBuffer, limite: number, escucha: Escucha): void {
    if (!this.ctx) return;
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
  }

  /**
   * El repuesto: etiqueta `<audio>` y un corte por temporizador.
   *
   * En el paso de 0,1 s esto es aproximado y no hay forma de que no lo sea. Se prefiere
   * un paso 1 impreciso a una pantalla muda.
   */
  private sonarConRepuesto(slug: string, limite: number, escucha: Escucha): void {
    let el = this.repuesto;
    if (!el) {
      try {
        el = new Audio();
      } catch {
        // Ni Web Audio ni `<audio>`: no hay con que sonar. Se avisa que termino para que
        // el boton no quede trabado en "Parar" esperando algo que no va a pasar.
        this.terminar(escucha);
        return;
      }
      this.repuesto = el;
    }
    if (!el.src.endsWith(`${slug}.mp3`)) el.src = urlDeFragmento(slug);

    /*
     * **El corte va por posición del audio, no por reloj de pared, y era el otro defecto.**
     *
     * Antes esto cortaba con `setTimeout(..., limite * 1000)` contado desde que se pedía
     * `play()`. En el paso 1 eso son **100 milisegundos**: un `<audio>` recién apuntado a
     * un `src` no llega a emitir una sola muestra en ese tiempo en ningún teléfono, así
     * que se pausaba antes de empezar. **Los primeros pasos de este camino eran mudos por
     * construcción**, y nadie se enteraba porque el juego reportaba que había terminado.
     *
     * Ahora el reloj es `currentTime`, que solo avanza cuando el audio suena de verdad:
     * el corte cae donde tiene que caer aunque el arranque tarde. Y queda un tope de
     * seguridad generoso por si nunca arranca, para que el botón no se trabe.
     */
    const cortar = () => {
      el.pause();
      this.terminar(escucha);
    };
    // El mismo bucle mueve la barra y decide el corte: son la misma pregunta —cuánto
    // sonó de verdad— y separarlas fue justamente lo que dejó el corte contando otra cosa.
    const vigilar = (): void => {
      const t = el.currentTime;
      escucha.alAvanzar?.(Math.min(t, limite));
      if (t >= limite) {
        cortar();
        return;
      }
      this.cuadro = requestAnimationFrame(vigilar);
    };

    el.currentTime = 0;
    const promesa = el.play();
    if (promesa) promesa.catch(() => this.terminar(escucha));
    // Tope de seguridad: el largo del paso más cinco segundos de gracia para que el
    // archivo arranque. Sin esto, un audio que nunca suena deja el botón en "Parar".
    this.cortar = window.setTimeout(cortar, (limite + 5) * 1000);
    escucha.alAvanzar?.(0);
    this.cuadro = requestAnimationFrame(vigilar);
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
    // Cada vez que se deja de sonar, la vuelta que estaba en curso deja de estar vigente:
    // cualquier promesa de `resume()` que resuelva después de acá ya no arranca nada. Ver
    // el comentario largo de `sonar()`.
    this.vuelta += 1;
    if (this.cuadro) cancelAnimationFrame(this.cuadro);
    if (this.cortar) clearTimeout(this.cortar);
    this.cuadro = 0;
    this.cortar = 0;
    this.fuente = null;
    // La salida se suelta acá porque acá pasan las dos únicas puertas por las que se deja
    // de sonar —`terminar()` y `detener()`— y escribir la línea dos veces es escribir dos
    // veces la posibilidad de olvidarse de una.
    this.soltarSalida?.();
    this.soltarSalida = null;
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
