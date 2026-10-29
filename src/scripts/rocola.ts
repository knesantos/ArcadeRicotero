/**
 * La rocola de los recitales (`D-72`): hace sonar recortes de a uno, o una lista entera, uno
 * detrás del otro. La usan "Armá tu recital" y la página "En vivo" de la Redondopedia.
 *
 * ## Por qué un `<audio>` y no Web Audio
 *
 * Por lo mismo que "Ponelos en fila" (`D-69`): acá no hay escalera de una décima que medir, y
 * un `<audio>` sale por la sesión de la música, así que suena aunque el iPhone tenga la llave
 * de silencio puesta (`D-66`). Nada suena sin un toque: cada recorte o cada lista sale del
 * gesto de quien lo pidió.
 *
 * ## Diez segundos por tema
 *
 * Los recortes duran quince (`CTR-01.4`), y la rocola corta en diez: una lista de veinte
 * temas suena en poco más de tres minutos, que es lo que dura una partida acá (`CLAUDE.md`).
 * El corte lo dice la pantalla, para que nadie espere el tema entero.
 */

import { urlDeFragmento } from '../lib/audio/rutas-de-audio.ts';

export const SEGUNDOS_POR_TEMA = 10;

export interface Rocola {
  /**
   * Hace sonar un recorte. Si ya sonaba otro, lo corta. `url` reemplaza al fragmento del tema
   * (el bestiario la usa para el recorte que arranca en el verso, `D-78`); entonces `clave` es
   * lo que devuelve `sonando`.
   */
  tocar(clave: string, alTerminar?: () => void, url?: string): void;
  /**
   * Hace sonar una lista en orden. `alCambiar` avisa qué posición empieza a sonar, y
   * `alTerminar`, que terminó o que alguien la cortó.
   */
  tocarLista(slugs: readonly string[], alCambiar: (posicion: number) => void, alTerminar: (completa: boolean) => void): void;
  parar(): void;
  /** El slug que suena, o `null`. */
  readonly sonando: string | null;
}

export function crearRocola(): Rocola {
  let audio: HTMLAudioElement | null = null;
  // Cada pedido nuevo sube la vuelta: un evento de un pedido viejo no hace nada.
  let vuelta = 0;
  let actual: string | null = null;
  let alFin: (() => void) | null = null;

  function terminar(v: number): void {
    if (v !== vuelta) return;
    audio?.pause();
    actual = null;
    const f = alFin;
    alFin = null;
    f?.();
  }

  function sonar(slug: string, v: number, siguiente: () => void, url = urlDeFragmento(slug)): void {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'none';
    }
    const a = audio;
    actual = slug;
    a.onended = () => v === vuelta && siguiente();
    a.onerror = () => v === vuelta && siguiente();
    a.ontimeupdate = () => {
      if (v === vuelta && a.currentTime >= SEGUNDOS_POR_TEMA) siguiente();
    };
    a.src = url;
    a.currentTime = 0;
    void a.play().catch(() => {
      // Sin gesto o sin red: no suena, y la lista no se queda colgada esperando.
      if (v === vuelta) terminar(v);
    });
  }

  const rocola: Rocola = {
    tocar(clave, alTerminar, url) {
      const anterior = alFin;
      alFin = null;
      const v = ++vuelta;
      anterior?.();
      alFin = alTerminar ?? null;
      sonar(clave, v, () => terminar(v), url);
    },
    tocarLista(slugs, alCambiar, alTerminar) {
      const anterior = alFin;
      alFin = null;
      const v = ++vuelta;
      anterior?.();
      // `completa` es verdad solo si sonó hasta el último: cortada con "Pará", o porque el
      // navegador no la dejó sonar, la lista no "terminó".
      let completa = false;
      alFin = () => alTerminar(completa);
      let i = 0;
      const siguiente = (): void => {
        if (v !== vuelta) return;
        if (i >= slugs.length) {
          completa = true;
          terminar(v);
          return;
        }
        const posicion = i++;
        alCambiar(posicion);
        sonar(slugs[posicion]!, v, siguiente);
      };
      siguiente();
    },
    parar() {
      const v = vuelta;
      terminar(v);
      vuelta++;
    },
    get sonando() {
      return actual;
    },
  };
  return rocola;
}
