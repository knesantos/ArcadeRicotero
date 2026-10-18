/**
 * El recital del otro lado del monte (`D-76`): mientras se camina, suenan de lejos recortes del
 * disco del camino (`lib/bestiario/sonido.ts` dice cuál), uno detrás del otro, con un respiro
 * entre tema y tema.
 *
 * ## Cómo suena "de lejos"
 *
 * Web Audio, y no un `<audio>` pelado, porque lo lejano es un filtro: el recorte pasa por un
 * pasabajos (lo que viene de lejos pierde los agudos), un pasaaltos (y el cuerpo de los graves),
 * y un eco corto y oscuro, que es el rebote contra los árboles. Todo bajito. A medida que se
 * camina el pasabajos se abre un poco: el cruce queda más cerca del recital que la entrada.
 *
 * ## Nada suena sin un toque
 *
 * Igual que en todo el sitio (`D-66`): arranca apagado y se prende con el botón del camino. Si la
 * persona lo dejó prendido, la próxima página lo recuerda, pero igual espera el primer toque,
 * porque el navegador no deja sonar nada antes. Pide la sesión de la música
 * (`sonarAunqueEsteEnSilencio`): quien lo prendió lo quiere oír aunque la llave del iPhone esté
 * en silencio.
 */

import { contextoDeAudio, despertarSalida } from '../../lib/audio/contexto.ts';
import { sonarAunqueEsteEnSilencio } from '../../lib/audio/sesion.ts';

/** El volumen de todo el recital: de fondo, que no tape el bocadillo ni el paso. */
const VOLUMEN = 0.5;
/** Cuando suena otra cosa de cerca (los diez segundos de una ficha), el recital se aparta. */
const APARTADO = 0.08;
/** El pasabajos en la entrada del camino y en el cruce, en hercios. */
const FILTRO = { desde: 650, hasta: 1300 } as const;
/** Lo que tarda en entrar y salir cada recorte, en segundos. */
const FUNDIDO = { entra: 1.4, sale: 2.2 } as const;
/** El respiro entre tema y tema, en segundos. */
const RESPIRO = { min: 1.5, max: 4 } as const;

export interface Lejos {
  /** Lo prende. Tiene que salir de un toque. Devuelve si quedó sonando. */
  prender(): Promise<boolean>;
  apagar(): void;
  /** Cuánto se caminó, de 0 a 1: abre un poco el filtro. */
  acercar(p: number): void;
  /** Se aparta mientras suena otra cosa de cerca, y vuelve cuando termina. */
  apartar(si: boolean): void;
  readonly prendido: boolean;
}

export function crearLejos(urls: readonly string[]): Lejos {
  let salida: AudioContext | null = null;
  let general: GainNode | null = null;
  let pasabajos: BiquadFilterNode | null = null;
  let entrada: AudioNode | null = null;

  let prendido = false;
  let apartado = false;
  /** Cada vez que se apaga sube la vuelta: lo que quedó agendado de antes no hace nada. */
  let vuelta = 0;
  let fuente: AudioBufferSourceNode | null = null;
  let espera = 0;

  // El orden: barajado, y se vuelve a barajar al terminar la vuelta.
  let cola: string[] = [];
  const buffers = new Map<string, Promise<AudioBuffer | null>>();

  function siguienteUrl(): string {
    if (!cola.length) {
      cola = [...urls];
      for (let i = cola.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cola[i], cola[j]] = [cola[j]!, cola[i]!];
      }
    }
    return cola.shift()!;
  }

  function cargar(url: string): Promise<AudioBuffer | null> {
    let p = buffers.get(url);
    if (!p) {
      p = fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then((datos) => salida!.decodeAudioData(datos))
        .catch(() => null);
      buffers.set(url, p);
      // Ninguno de los recortes pesa más de 210 KB, pero tampoco se guardan todos.
      if (buffers.size > 4) buffers.delete(buffers.keys().next().value!);
    }
    return p;
  }

  /** El camino de la señal: recorte → pasabajos → pasaaltos → general, y un eco oscuro. */
  function armar(ctx: AudioContext): void {
    general = ctx.createGain();
    general.gain.value = 0;
    general.connect(ctx.destination);

    pasabajos = ctx.createBiquadFilter();
    pasabajos.type = 'lowpass';
    pasabajos.frequency.value = FILTRO.desde;
    pasabajos.Q.value = 0.6;

    const pasaaltos = ctx.createBiquadFilter();
    pasaaltos.type = 'highpass';
    pasaaltos.frequency.value = 140;
    pasabajos.connect(pasaaltos);
    pasaaltos.connect(general);

    const eco = ctx.createDelay(1);
    eco.delayTime.value = 0.14;
    const vuelve = ctx.createGain();
    vuelve.gain.value = 0.32;
    const mojado = ctx.createGain();
    mojado.gain.value = 0.45;
    pasaaltos.connect(eco);
    eco.connect(vuelve);
    vuelve.connect(eco);
    eco.connect(mojado);
    mojado.connect(general);

    entrada = pasabajos;
  }

  function volumen(): number {
    return prendido ? (apartado ? APARTADO : VOLUMEN) : 0;
  }

  async function tocar(v: number): Promise<void> {
    if (v !== vuelta || !salida || !entrada) return;
    const url = siguienteUrl();
    const buffer = await cargar(url);
    if (v !== vuelta) return;
    // El de después se va bajando mientras suena este.
    if (urls.length > 1) void cargar(cola[0] ?? urls[0]!);
    if (!buffer) {
      espera = window.setTimeout(() => void tocar(v), 1000);
      return;
    }
    const ctx = salida;
    const ahora = ctx.currentTime;
    const dura = buffer.duration;
    const tramo = ctx.createGain();
    tramo.gain.setValueAtTime(0, ahora);
    tramo.gain.linearRampToValueAtTime(1, ahora + FUNDIDO.entra);
    tramo.gain.setValueAtTime(1, ahora + Math.max(FUNDIDO.entra, dura - FUNDIDO.sale));
    tramo.gain.linearRampToValueAtTime(0, ahora + dura);
    tramo.connect(entrada);
    const f = ctx.createBufferSource();
    f.buffer = buffer;
    f.connect(tramo);
    f.onended = () => {
      tramo.disconnect();
      if (fuente === f) fuente = null;
      if (v !== vuelta) return;
      const respiro = RESPIRO.min + Math.random() * (RESPIRO.max - RESPIRO.min);
      espera = window.setTimeout(() => void tocar(v), respiro * 1000);
    };
    fuente = f;
    f.start(ahora);
  }

  function llevarVolumen(): void {
    if (!salida || !general) return;
    general.gain.setTargetAtTime(volumen(), salida.currentTime, 0.35);
  }

  // Con la página escondida (otra pestaña, el teléfono bloqueado), el recital se calla.
  document.addEventListener('visibilitychange', () => {
    if (!salida || !prendido) return;
    if (document.visibilityState === 'visible') void salida.resume().catch(() => {});
    else void salida.suspend().catch(() => {});
  });

  return {
    async prender() {
      if (prendido) return true;
      if (!urls.length) return false;
      sonarAunqueEsteEnSilencio();
      salida = contextoDeAudio();
      if (!salida) return false;
      const estado = await despertarSalida();
      if (estado !== 'running') return false;
      if (!entrada) armar(salida);
      prendido = true;
      llevarVolumen();
      void tocar(++vuelta);
      return true;
    },
    apagar() {
      if (!prendido) return;
      prendido = false;
      vuelta++;
      clearTimeout(espera);
      llevarVolumen();
      const f = fuente;
      fuente = null;
      // Se va con el volumen; la fuente se corta cuando ya no se oye.
      if (f && salida) {
        try {
          f.stop(salida.currentTime + 1.2);
        } catch {
          // Ya había terminado.
        }
      }
    },
    acercar(p) {
      if (!salida || !pasabajos) return;
      const q = Math.min(1, Math.max(0, p));
      pasabajos.frequency.setTargetAtTime(FILTRO.desde + (FILTRO.hasta - FILTRO.desde) * q, salida.currentTime, 0.5);
    },
    apartar(si) {
      if (apartado === si) return;
      apartado = si;
      llevarVolumen();
    },
    get prendido() {
      return prendido;
    },
  };
}
