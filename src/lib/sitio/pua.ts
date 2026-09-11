/**
 * La púa: el ruido de cambio entre pieza y pieza (`ADR-07.7`, `T-218`).
 *
 * Es lo que el pedido del usuario llamó *"un ruido como cambia el vinilo o el cassete"*.
 * Tres gestos pegados: el **golpe** del mecanismo al trabar, el **barrido** de la púa
 * deslizando hasta apoyar, y el **surco** vacío con su polvo antes de que entre el tema.
 *
 * ## Por qué esto no contradice `ADR-04.1`
 *
 * `ADR-04.1` prohíbe los eventos sonoros puntuales, y la prohibición sigue entera para los
 * de **interfaz**: clic, acierto, error, cambio de pantalla. La púa no es uno de esos — **no
 * la dispara un dedo, la dispara el aparato cambiando de pieza**. `ADR-07.7` la declara la
 * única excepción escrita, y el límite está puesto justamente para que no se estire.
 *
 * ## Y por qué no es decoración
 *
 * Un `<audio>` que recién recibió su `src` tarda en dar la primera muestra — el mismo
 * defecto que `tema/audio.ts` ya documenta para su camino de repuesto. Sin la púa, ese hueco
 * suena a que el sitio se rompió. **La púa tapa la latencia de arranque del stream**, y por
 * eso se pide junto con el `play()` y no después. Si el tema tarda más que `PUA_SEG`, abajo
 * sigue la cama y se aguanta.
 *
 * ## Módulo hoja: no importa nada, ni siquiera el contexto
 *
 * Recibe el contexto y el nodo adonde ir. Es lo que lo deja paralelo a `rocola.ts` y lo que
 * hace que `D-29` se cumpla por construcción: **lo que nunca importa, nunca arrastra un
 * `node:*` al teléfono de la gente.**
 *
 * ## Lo prohibido acá adentro, que es la lista de `ADR-04.1` sin descuento
 *
 * `ConvolverNode`, `AudioWorkletNode`, `ScriptProcessorNode`, cualquier archivo, cualquier
 * `setTimeout` —se programa en el reloj del audio y se frena con `stop(t)`, como hace
 * `desarmar()` en `cinta.ts`— y cualquier importación.
 *
 * ## Nunca toca `destination`
 *
 * Va al nodo que le pasen. Es lo que hace que se calle con todo lo demás cuando la cinta se
 * calla: un ruido colgado del destino sobreviviría al apagón y sonaría solo.
 */

// ---------------------------------------------------------------------------------------
// Las constantes de `ADR-07.7`. Ningún número de audio se escribe dos veces en este repo.
// Se exportan porque las pruebas las necesitan, y una prueba que reescriba el número lo
// escribiría dos veces.
// ---------------------------------------------------------------------------------------

/** El gesto entero: golpe + barrido + surco. Es lo que la rocola usa para programar el tema. */
export const PUA_SEG = 0.5;
/** El clac del mecanismo al trabar. */
export const GOLPE_SEG = 0.015;
/** Bandpass del golpe: plástico y madera, no metal. */
export const GOLPE_HZ = 2200;
/** La púa deslizando, arriba de todo. */
export const BARRIDO_DESDE_HZ = 5000;
/** Dónde apoya. */
export const BARRIDO_HASTA_HZ = 400;
/** Lo que tarda en bajar. **Más y suena a efecto de dibujo animado.** */
export const BARRIDO_SEG = 0.18;
/** El surco vacío antes del tema. */
export const SURCO_SEG = 0.3;
/** El polvo: impulsos de 1–2 ms sorteados adentro del surco. **Más de tres y es una parodia.** */
export const CHASQUIDOS = 3;
/** El nivel del gesto. **Techo duro `0.3`**: se afina de oído contra `GANANCIA_ROCOLA`. */
export const GANANCIA_PUA = 0.18;
/** El buffer propio del módulo: ~96 KB a 48 kHz, generado una vez por página. */
export const LARGO_RUIDO_PUA_SEG = 0.5;

/*
 * Los anchos de campana y los niveles relativos de cada gesto. No están en la tabla de
 * `ADR-07.7` pero valen la misma regla: acá una vez, en ningún otro lado. Quedan sin
 * exportar porque no son promesas del contrato — son la forma de cada golpe.
 */
const Q_GOLPE = 1.2;
const Q_BARRIDO = 1.0;
/** El surco es la cola del gesto: se oye, no se anuncia. */
const NIVEL_SURCO = 0.35;
/** Un chasquido es un pinchazo, no un golpe: corto y por encima del surco. */
const NIVEL_CHASQUIDO = 0.5;
const CHASQUIDO_MIN_SEG = 0.001;
const CHASQUIDO_MAX_SEG = 0.002;
/**
 * El piso de todos los gestos. Sin esto, el golpe y el surco traen el sub del ruido blanco,
 * que en un parlante de teléfono no se oye y en auriculares es un golpe de aire.
 */
const PISO_PUA_HZ = 150;

/**
 * El ruido del módulo, generado una vez por página y conservado entre púas.
 *
 * Son ~24.000 llamadas a `Math.random()` a 48 kHz: milisegundos. Regenerarlo en cada cambio
 * de tema sería trabajo por nada, y la rocola cambia de tema cada diez segundos cuando suena
 * con recortes — que es el caso de hoy, y el que más se nota.
 */
let ruidoPua: AudioBuffer | null = null;

/**
 * El bloque de ruido blanco. Sin cruce en los extremos, a diferencia del de la cama: acá
 * nada hace bucle largo, cada gesto toma un pedazo suelto y lo apaga con su propia envolvente.
 */
function generarRuidoPua(ctx: AudioContext): AudioBuffer {
  const muestras = Math.max(1, Math.floor(LARGO_RUIDO_PUA_SEG * ctx.sampleRate));
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
  return buffer;
}

/**
 * Suena la púa.
 *
 * Programa los tres gestos en el reloj del contexto y **devuelve el instante en que
 * termina**, que es lo que la rocola usa para saber cuándo entra el tema.
 *
 * Si algo tira —un navegador sin `createBiquadFilter`, un contexto cerrado— suelta lo que
 * haya creado y devuelve igual el instante de fin. **El tema tiene que arrancar aunque la
 * púa no suene**: quedarse sin ruido de cambio es un detalle, quedarse sin música es el
 * defecto.
 */
export function pua(ctx: AudioContext, destino: AudioNode, cuando?: number): number {
  // Nunca en el pasado: un `start()` con un instante ya vencido suena inmediatamente en
  // algunos motores y no suena en otros, y esa diferencia no se puede probar.
  const t0 = Math.max(cuando ?? ctx.currentTime, ctx.currentTime);
  const fin = t0 + PUA_SEG;

  const creados: Array<{ disconnect: () => void }> = [];
  const anotar = <T extends { disconnect: () => void }>(nodo: T): T => {
    creados.push(nodo);
    return nodo;
  };
  const soltar = (): void => {
    for (const n of creados) {
      try {
        n.disconnect();
      } catch {
        /* ya estaba suelto */
      }
    }
    creados.length = 0;
  };

  try {
    if (!ruidoPua) ruidoPua = generarRuidoPua(ctx);
    const largoRuido = ruidoPua.duration;

    /**
     * Un gesto: un pedazo de ruido, una campana y una envolvente.
     *
     * `loop` va en `true` y el arranque se sortea adentro del buffer para que dos púas
     * seguidas no sean la misma grabación. Con el bucle puesto, el desplazamiento no puede
     * caerse del final — que es el defecto que aparece recién cuando el sorteo da alto.
     */
    const gesto = (
      tipo: BiquadFilterType,
      hz: number,
      q: number,
      inicio: number,
      duracion: number,
      nivel: number,
    ): { campana: BiquadFilterNode; fuente: AudioBufferSourceNode } => {
      const fuente = anotar(ctx.createBufferSource());
      fuente.buffer = ruidoPua;
      fuente.loop = true;

      const campana = anotar(ctx.createBiquadFilter());
      campana.type = tipo;
      campana.frequency.value = hz;
      campana.Q.value = q;

      const piso = anotar(ctx.createBiquadFilter());
      piso.type = 'highpass';
      piso.frequency.value = PISO_PUA_HZ;

      const volumen = anotar(ctx.createGain());
      // La envolvente: sube en un instante y cae. Un ruido que entra sin rampa chasquea, y
      // el chasquido de una envolvente mal hecha no suena a púa, suena a defecto.
      volumen.gain.setValueAtTime(0, inicio);
      volumen.gain.linearRampToValueAtTime(GANANCIA_PUA * nivel, inicio + Math.min(0.004, duracion / 3));
      volumen.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

      fuente.connect(campana).connect(piso).connect(volumen).connect(destino);
      fuente.start(inicio, Math.random() * Math.max(0, largoRuido - 0.01));
      fuente.stop(inicio + duracion);
      return { campana, fuente };
    };

    // 1. El golpe. Corto y con cuerpo: es el mecanismo trabando, no la púa todavía.
    gesto('bandpass', GOLPE_HZ, Q_GOLPE, t0, GOLPE_SEG, 1);

    // 2. El barrido. La misma campana bajando de 5000 a 400: es la púa deslizando hasta
    //    apoyar. La rampa es exponencial porque la frecuencia se oye en octavas, no en
    //    hertz: una rampa lineal baja todo el efecto al final y suena a caída, no a barrido.
    const barridoDesde = t0 + GOLPE_SEG;
    const barrido = gesto('bandpass', BARRIDO_DESDE_HZ, Q_BARRIDO, barridoDesde, BARRIDO_SEG, 0.8);
    barrido.campana.frequency.setValueAtTime(BARRIDO_DESDE_HZ, barridoDesde);
    barrido.campana.frequency.exponentialRampToValueAtTime(BARRIDO_HASTA_HZ, barridoDesde + BARRIDO_SEG);

    // 3. El surco vacío, ya apoyada. Es lo que hace que el tema entre "desde" algún lado en
    //    vez de aparecer. **Es el gesto que termina último**, así que es el que avisa.
    const surcoDesde = barridoDesde + BARRIDO_SEG;
    const surco = gesto('lowpass', BARRIDO_HASTA_HZ * 3, 0.7, surcoDesde, SURCO_SEG, NIVEL_SURCO);

    // 4. El polvo. Tres pinchazos sorteados adentro del surco, nunca pegados al final: un
    //    chasquido encima del primer acorde del tema no es polvo, es un error de mezcla.
    const margen = Math.max(0, SURCO_SEG - CHASQUIDO_MAX_SEG * 2);
    for (let i = 0; i < CHASQUIDOS; i++) {
      const cuandoChasquido = surcoDesde + Math.random() * margen;
      const largo = CHASQUIDO_MIN_SEG + Math.random() * (CHASQUIDO_MAX_SEG - CHASQUIDO_MIN_SEG);
      gesto('highpass', 3000, 0.7, cuandoChasquido, largo, NIVEL_CHASQUIDO);
    }

    /*
     * El barrido de limpieza. Se cuelga del gesto más largo —el surco termina último— y
     * suelta todo cuando ese `stop` se hace efectivo. Es un evento, no una encuesta:
     * `ADR-04.10` prohíbe las dos formas de mirar el reloj, y esta no es ninguna.
     *
     * Los chasquidos pueden terminar antes, y no importa: lo que se suelta es el grafo
     * entero de esta púa, de una sola vez.
     */
    surco.fuente.onended = soltar;
  } catch {
    // Si el gesto no se pudo programar, se suelta ahora. El tema arranca igual: la púa es
    // lo que tapa la latencia, no lo que la produce.
    soltar();
  }

  return fin;
}

/**
 * Suelta el bloque de ruido del módulo.
 *
 * **Solo para las pruebas.** Un módulo que se queda con lo que vio al nacer no se puede
 * probar dos veces con contextos distintos, que es exactamente lo que hace una prueba.
 */
export function reiniciarPuaParaPruebas(): void {
  ruidoPua = null;
}
