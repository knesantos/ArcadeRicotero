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
  g.Audio = function () {
    const el = { src: '', currentTime: 0, preload: '', play: () => Promise.resolve(), pause() {} };
    audios.push(el as never);
    return el;
  };
  g.requestAnimationFrame = () => 0;
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
      g.requestAnimationFrame = previos.requestAnimationFrame;
      g.window = previos.window;
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
    await new Promise((res) => setTimeout(res, 40));

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
    await new Promise((res) => setTimeout(res, 40));
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
