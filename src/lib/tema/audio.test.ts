/**
 * Verificación del motor de audio contra el defecto que reportó el usuario:
 * **en el celular no se escuchaba nada; en escritorio andaba bien.**
 *
 * La causa era una sola línea que no existía. `sonar()` tomaba el camino de Web Audio
 * apenas había contexto y buffer, **sin mirar si el contexto estaba corriendo**. En
 * escritorio el contexto nace `running` y todo funcionaba; en el celular nace `suspended`,
 * y entonces `fuente.start()` programaba contra un reloj detenido: no sonaba nada,
 * `onended` no disparaba nunca, el botón quedaba trabado en "Parar" y la barra no se
 * movía. Un silencio que además no avisaba.
 *
 * Estas pruebas corren en Node con dobles de `AudioContext` y de `Audio`, así que fijan la
 * lógica sin necesitar un navegador — que es justo lo que no se puede automatizar acá.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Reproductor } from './audio.ts';
import { reiniciarAudioParaPruebas, salidaOcupada } from '../audio/contexto.ts';

type Estado = 'running' | 'suspended' | 'interrupted' | 'closed';

/** Un `AudioContext` de mentira que deja mirar qué se le pidió. */
function contextoFalso(estadoInicial: Estado, resumeFunciona = true) {
  const registro = { arrancados: 0, resumes: 0, mudos: 0 };
  const ctx = {
    state: estadoInicial as Estado,
    currentTime: 0,
    sampleRate: 44100,
    destination: {},
    resume() {
      registro.resumes++;
      if (!resumeFunciona) return Promise.reject(new Error('no'));
      ctx.state = 'running';
      return Promise.resolve();
    },
    createBuffer() {
      registro.mudos++;
      return { duration: 0 } as unknown as AudioBuffer;
    },
    createBufferSource() {
      return {
        buffer: null as AudioBuffer | null,
        onended: null as null | (() => void),
        connect() {},
        start() {
          registro.arrancados++;
        },
        stop() {},
        disconnect() {},
      };
    },
    decodeAudioData: async () => ({}) as AudioBuffer,
  };
  return { ctx, registro };
}

/** Instala los dobles en el entorno global y devuelve cómo desarmarlos. */
function conEntorno(estado: Estado, resumeFunciona = true) {
  const { ctx, registro } = contextoFalso(estado, resumeFunciona);
  const audios: Array<{ play: () => Promise<void>; src: string }> = [];
  const g = globalThis as Record<string, unknown>;
  const previos = { AudioContext: g.AudioContext, Audio: g.Audio, requestAnimationFrame: g.requestAnimationFrame, window: g.window };

  g.AudioContext = function () {
    return ctx;
  };
  // El `<audio>` de mentira **avanza su reloj**, como el de verdad: el corte del repuesto
  // ahora depende de `currentTime`, asi que un doble congelado no probaria nada.
  g.Audio = function () {
    const el = {
      src: '',
      currentTime: 0,
      preload: '',
      play() {
        el.currentTime = 0;
        const reloj = setInterval(() => {
          el.currentTime += 0.02;
        }, 5);
        (el as Record<string, unknown>).reloj = reloj;
        return Promise.resolve();
      },
      pause() {
        clearInterval((el as Record<string, unknown>).reloj as never);
      },
    };
    audios.push(el as never);
    return el;
  };
  // Un `requestAnimationFrame` que de verdad vuelve a llamar: sin esto, el bucle que
  // vigila la posicion del audio no corre nunca y el corte no llega.
  g.requestAnimationFrame = (fn: () => void) => setTimeout(fn, 8) as unknown as number;
  g.cancelAnimationFrame = (id: number) => clearTimeout(id as never);
  // `setTimeout` delega en el real: el camino de repuesto corta por temporizador, y un
  // doble que nunca dispara haria fallar la prueba por un motivo que no es del producto.
  g.window = {
    AudioContext: g.AudioContext,
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms) as unknown as number,
    clearTimeout: (id: number) => clearTimeout(id as never),
  };

  return {
    ctx,
    registro,
    audios,
    restaurar() {
      g.AudioContext = previos.AudioContext;
      g.Audio = previos.Audio;
      // Se apagan los relojes de los `<audio>` y se deja un `requestAnimationFrame` que
      // NO vuelve a llamar: asi el bucle que vigila la posicion se corta solo en el
      // proximo tick en vez de seguir corriendo despues de que la prueba termino.
      for (const a of audios) (a as { pause?: () => void }).pause?.();
      g.requestAnimationFrame = previos.requestAnimationFrame ?? (() => 0);
      g.window = previos.window;
      // El contexto ya no vive adentro del `Reproductor`: lo presta `audio/contexto.ts`,
      // que lo guarda en su ambito de modulo (`ADR-04.2`). Sin este reinicio, el contexto
      // del caso anterior sobrevive al `new Reproductor()` del siguiente y el
      // `assert.equal(e.registro.mudos, 1)` empieza a contar buffers mudos ajenos. Ademas
      // apaga los cortes por temporizador que `sonar()` deja armados, que si no dejan el
      // proceso de las pruebas esperandolos.
      reiniciarAudioParaPruebas();
    },
  };
}

test('despertar destraba el celular: pide resume Y hace sonar un buffer mudo', () => {
  const e = conEntorno('suspended');
  try {
    const r = new Reproductor();
    r.despertar();
    assert.equal(e.registro.resumes, 1, 'un contexto parado tiene que pedir volver');
    assert.equal(e.registro.mudos, 1, 'el buffer mudo es lo que destraba iOS, no el resume solo');
  } finally {
    e.restaurar();
  }
});

test('el buffer mudo suena una sola vez, no en cada toque', () => {
  const e = conEntorno('suspended');
  try {
    const r = new Reproductor();
    r.despertar();
    r.despertar();
    r.despertar();
    assert.equal(e.registro.mudos, 1);
  } finally {
    e.restaurar();
  }
});

test('🔴 el defecto: con el contexto suspendido, sonar NO puede quedarse mudo', async () => {
  // Es la prueba que describe el reporte del usuario. Antes de la correccion, este camino
  // llamaba a `start()` sobre un reloj detenido y no avisaba nunca. Ahora tiene que
  // resumir primero, y recien despues arrancar.
  const e = conEntorno('suspended');
  try {
    const r = new Reproductor();
    r.despertar();
    e.ctx.state = 'suspended'; // el celular lo vuelve a parar entre el gesto y el toque
    const antes = e.registro.arrancados;

    let termino = false;
    r.sonar('un-tema', 0.01, { alTerminar: () => (termino = true) });
    await new Promise((res) => setTimeout(res, 120));

    assert.equal(e.ctx.state, 'running', 'tiene que haber pedido volver antes de sonar');
    assert.ok(
      e.registro.arrancados > antes || termino,
      'o suena, o avisa que termino — lo que no puede es quedarse mudo sin decir nada',
    );
  } finally {
    e.restaurar();
  }
});

test('Safari despues de una llamada deja el contexto en `interrupted`, y tampoco cuelga', async () => {
  const e = conEntorno('interrupted');
  try {
    const r = new Reproductor();
    r.despertar();
    let termino = false;
    r.sonar('un-tema', 5, { alTerminar: () => (termino = true) });
    await new Promise((res) => setTimeout(res, 0));
    assert.ok(e.ctx.state === 'running' || termino);
  } finally {
    e.restaurar();
  }
});

test('si el contexto no vuelve, cae al repuesto en vez de dejar el boton trabado', async () => {
  const e = conEntorno('suspended', /* resumeFunciona */ false);
  try {
    const r = new Reproductor();
    r.despertar();
    let termino = false;
    r.sonar('un-tema', 0.01, { alTerminar: () => (termino = true) });
    await new Promise((res) => setTimeout(res, 120));
    // El repuesto es `<audio>`: lo que importa es que ALGO haya pasado y que el juego no
    // se quede esperando un `onended` que no va a llegar.
    assert.ok(e.audios.length > 0 || termino, 'sin salida ni aviso, el boton queda en "Parar" para siempre');
  } finally {
    e.restaurar();
  }
});

test('con el contexto corriendo suena directo, sin resume de mas', () => {
  // El caso de escritorio, que andaba bien y no se puede haber roto.
  const e = conEntorno('running');
  try {
    const r = new Reproductor();
    r.despertar();
    const resumesTrasDespertar = e.registro.resumes;
    r.sonar('un-tema', 5, {});
    assert.equal(e.registro.resumes, resumesTrasDespertar, 'un contexto corriendo no necesita volver');
  } finally {
    e.restaurar();
  }
});

test('🔴 el LRU no puede desalojar el tema que esta por sonar', async () => {
  // El defecto que encontro el analisis, simulado con la ronda real: 4 temas,
  // MAX_BUFFERS = 3 y una ventana de precarga de 2. Al arrancar el tema 2, precargar el
  // tema 4 disparaba el desalojo y el que salia era **el buffer del tema 2**, el que
  // estaba por sonar. Caia al repuesto <audio>, que en los primeros pasos era mudo por
  // construccion: el segundo tema de cada vuelta no sonaba.
  const e = conEntorno('running');
  const fetchPrevio = globalThis.fetch;
  try {
    (globalThis as Record<string, unknown>).fetch = async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    });
    const r = new Reproductor();
    r.despertar();

    const ronda = ['a', 'b', 'c', 'd'];
    // Tema 1: se precarga el actual y los dos que vienen.
    await r.precargar('a');
    await r.precargar('b');
    await r.precargar('c');
    r.sonar('a', 1, {});

    // Tema 2: se vuelve a pedir el actual (acierto de cache) y entra el cuarto.
    await r.precargar('b');
    await r.precargar('c');
    await r.precargar('d');

    // La pregunta que importa: al tocar "Escucha" en el tema 2, ¿esta su buffer?
    r.sonar('b', 1, {});
    assert.equal(
      e.registro.arrancados >= 2,
      true,
      'el tema 2 tuvo que sonar por Web Audio, no caer al repuesto',
    );
    void ronda;
  } finally {
    (globalThis as Record<string, unknown>).fetch = fetchPrevio;
    e.restaurar();
  }
});

test('🔴 frenar antes de que vuelva el contexto frena de verdad, y no deja un sonido huerfano', async () => {
  /*
   * La carrera que encontro una refutacion adversarial del ciclo 11, no una prueba.
   *
   * Con el contexto dormido, `sonar()` pide `resume()` y se va a esperar. Si en ese hueco
   * entra `detener()` —tocar "Escuchar" y tocar "Parar" antes de que Safari conteste—, la
   * promesa resolvia igual y **el fragmento arrancaba despues de que la persona lo freno**.
   *
   * Ese defecto ya estaba y era molesto. Con el token de la salida (`ADR-04.3`) paso a ser
   * peor: `detener()` ya solto la salida, asi que ese sonido huerfano suena con la salida
   * declarada **libre** y la cama de cinta vuelve a subir encima. Sin sintoma para nadie.
   *
   * La ventana es angosta en escritorio y ancha volviendo de una llamada, que es justo
   * cuando aparece `interrupted`.
   */
  const e = conEntorno('suspended');
  try {
    const r = new Reproductor();
    r.despertar();
    const arrancadosAntes = e.registro.arrancados;

    r.sonar('un-tema', 15, {});
    // En la misma vuelta sincronica, antes de que resuelva el `resume()`.
    r.detener();
    assert.equal(salidaOcupada(), false, 'detener tiene que soltar la salida');

    // Se le da tiempo a la promesa del `resume()` a resolver.
    await new Promise((listo) => setTimeout(listo, 30));

    assert.equal(
      e.registro.arrancados,
      arrancadosAntes,
      'arranco un fragmento despues de frenar: suena solo y con la salida declarada libre',
    );
    assert.equal(salidaOcupada(), false, 'la salida quedo tomada por un sonido que nadie pidio');
  } finally {
    e.restaurar();
  }
});
