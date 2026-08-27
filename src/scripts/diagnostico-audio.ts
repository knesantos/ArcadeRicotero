/**
 * El diagnóstico de audio. Existe porque no se puede arreglar a ciegas lo que no se
 * puede reproducir.
 *
 * El usuario reportó dos veces que en su celular no suenan los temas y en escritorio sí.
 * El primer intento de arreglo —destrabar el contexto, chequear su estado, manejar
 * `interrupted`— **no cambió nada**, y eso ya es información: la causa está en otro lado.
 *
 * En vez de seguir tirando arreglos a ver cuál pega, esta pantalla **mide** y muestra el
 * resultado ahí mismo, en el teléfono, para que se pueda leer o sacar una foto. Cada
 * chequeo dice qué se probó, qué dio, y qué significa.
 *
 * ## Las dos preguntas que esta pantalla existe para separar
 *
 * 1. **¿No suena, o suena y no se oye?** El primer paso del juego dura **una décima de
 *    segundo**. En un parlante de teléfono, con volumen medio, cien milisegundos de un
 *    mono a 64 kbps pueden ser literalmente imperceptibles. Acá hay un botón que suena
 *    **tres segundos seguidos**: si eso se oye, el motor anda y el problema es el largo
 *    del primer escalón, no el audio.
 * 2. **¿Falla Web Audio o falla todo?** Se prueban los dos caminos por separado — el
 *    `AudioContext` y la etiqueta `<audio>`— porque en iOS no se comportan igual, y saber
 *    cuál de los dos suena dice exactamente dónde está el problema.
 */

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const salida = $('resultados');

type Estado = 'ok' | 'mal' | 'aviso' | 'dato';

function fila(estado: Estado, que: string, valor: string, nota?: string): void {
  const li = document.createElement('li');
  li.className = `dg dg--${estado}`;
  const marca = document.createElement('span');
  marca.className = 'dg-marca';
  marca.textContent = estado === 'ok' ? '✓' : estado === 'mal' ? '✕' : estado === 'aviso' ? '!' : '·';
  const cuerpo = document.createElement('div');
  const t = document.createElement('p');
  t.className = 'dg-que';
  t.textContent = que;
  const v = document.createElement('p');
  v.className = 'dg-valor';
  v.textContent = valor;
  cuerpo.append(t, v);
  if (nota) {
    const n = document.createElement('p');
    n.className = 'dg-nota';
    n.textContent = nota;
    cuerpo.append(n);
  }
  li.append(marca, cuerpo);
  salida.append(li);
}

const SLUG = 'queso-ruso';
let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;

/** El navegador, sin pretender adivinar el modelo: lo que importa es el motor. */
function quienEs(): string {
  const ua = navigator.userAgent;
  const esIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const esAndroid = /Android/.test(ua);
  const motor = esIOS ? 'WebKit (iOS: todo navegador en iPhone es Safari por dentro)' : /Firefox/.test(ua) ? 'Gecko' : 'Blink/otro';
  return `${esIOS ? 'iPhone/iPad' : esAndroid ? 'Android' : 'escritorio u otro'} — ${motor}`;
}

async function correr(): Promise<void> {
  salida.replaceChildren();

  fila('dato', 'Qué aparato es', quienEs());

  // ---- 1. ¿Existe Web Audio?
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) {
    fila('mal', 'Web Audio API', 'no existe en este navegador', 'El juego cae al reproductor común. Debería sonar igual.');
  } else {
    try {
      ctx = new Ctor();
      fila('ok', 'Web Audio API', `existe · ${ctx.sampleRate} Hz`);
    } catch (e) {
      fila('mal', 'Web Audio API', `no se pudo crear: ${String(e)}`);
    }
  }

  // ---- 2. El estado del contexto, que es donde estaba el defecto de la primera vuelta
  if (ctx) {
    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch (e) {
        fila('mal', 'Despertar el audio', `falló: ${String(e)}`);
      }
    }
    const st = ctx.state;
    fila(
      st === 'running' ? 'ok' : 'mal',
      'Estado del motor de audio',
      st,
      st === 'running'
        ? 'Corriendo. Si igual no se oye, el problema no es este.'
        : 'Parado. El navegador no lo deja arrancar ni con un toque de por medio.',
    );
  }

  // ---- 3. ¿Llega el archivo?
  let crudo: ArrayBuffer | null = null;
  const url = `/audio/fragmentos/${SLUG}.mp3`;
  try {
    const t0 = performance.now();
    const resp = await fetch(url);
    const ms = Math.round(performance.now() - t0);
    if (!resp.ok) {
      fila('mal', 'Bajar el fragmento', `${resp.status} ${resp.statusText}`, `No llega el archivo: ${url}`);
    } else {
      crudo = await resp.arrayBuffer();
      fila(
        'ok',
        'Bajar el fragmento',
        `${Math.round(crudo.byteLength / 1024)} KB en ${ms} ms`,
        `${resp.headers.get('content-type') ?? 'sin content-type'}`,
      );
      if (crudo.byteLength < 10000) {
        fila('mal', 'Tamaño del archivo', 'sospechosamente chico', 'Debería rondar los 80 KB. Puede estar cortado.');
      }
    }
  } catch (e) {
    fila('mal', 'Bajar el fragmento', `falló: ${String(e)}`);
  }

  // ---- 4. ¿Se puede decodificar? (acá el juego se traga el error en un catch vacío)
  if (ctx && crudo) {
    try {
      buffer = await ctx.decodeAudioData(crudo.slice(0));
      fila('ok', 'Decodificar el mp3', `${buffer.duration.toFixed(2)} s · ${buffer.numberOfChannels} canal(es)`);
    } catch (e) {
      fila(
        'mal',
        'Decodificar el mp3',
        `falló: ${String(e)}`,
        'Este error el juego lo silencia. Si falla acá, es la causa.',
      );
    }
  }

  fila('dato', 'Ahora probá el sonido', 'Los dos botones de abajo, con el volumen fuerte.',
    'Si es un iPhone, fijate que la llave lateral de silencio no esté en silencio: apaga el audio del navegador.');
}

/** Suena tres segundos por Web Audio. El largo es el punto: 0,1 s no se percibe. */
async function probarWebAudio(): Promise<void> {
  if (!ctx || !buffer) {
    fila('mal', 'Prueba por Web Audio', 'no hay motor o no hay audio decodificado');
    return;
  }
  try {
    if (ctx.state !== 'running') await ctx.resume();
    const f = ctx.createBufferSource();
    f.buffer = buffer;
    f.connect(ctx.destination);
    f.start(0, 0, Math.min(3, buffer.duration));
    fila('aviso', 'Prueba por Web Audio', 'sonando 3 segundos…', '¿Se oyó? Si no, el problema es Web Audio en este aparato.');
  } catch (e) {
    fila('mal', 'Prueba por Web Audio', `falló: ${String(e)}`);
  }
}

/** Suena tres segundos por la etiqueta `<audio>`, que en iOS usa otra vía. */
async function probarEtiqueta(): Promise<void> {
  try {
    const el = new Audio(`/audio/fragmentos/${SLUG}.mp3`);
    el.volume = 1;
    await el.play();
    window.setTimeout(() => el.pause(), 3000);
    fila('aviso', 'Prueba con el reproductor común', 'sonando 3 segundos…', '¿Se oyó ESTE y no el otro? Entonces hay que cambiar de motor.');
  } catch (e) {
    fila('mal', 'Prueba con el reproductor común', `falló: ${String(e)}`, 'Si fallan los dos, el aparato no está dejando sonar nada.');
  }
}

$('correr').addEventListener('click', () => void correr());
$('probar-web').addEventListener('click', () => void probarWebAudio());
$('probar-etiqueta').addEventListener('click', () => void probarEtiqueta());
