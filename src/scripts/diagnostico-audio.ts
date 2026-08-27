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

/**
 * Navegadores incrustados adentro de otra aplicación.
 *
 * **Es la sospecha que más rinde y la que menos se mira.** Si el enlace se abrió desde
 * WhatsApp, Instagram, Facebook o Telegram, la página no corre en el navegador del
 * teléfono: corre en una ventana que esas aplicaciones traen adentro. Esas ventanas
 * recortan cosas —el audio entre ellas— de maneras que el navegador de verdad no.
 *
 * Y encaja con el síntoma como un guante: en la computadora el enlace se abre en el
 * navegador normal y anda; en el teléfono se toca desde el chat donde llegó y no.
 */
function navegadorIncrustado(ua: string): string | null {
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'Facebook';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/WhatsApp/i.test(ua)) return 'WhatsApp';
  if (/Telegram/i.test(ua)) return 'Telegram';
  if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) return 'TikTok';
  if (/Twitter/i.test(ua)) return 'Twitter/X';
  if (/Line\//i.test(ua)) return 'LINE';
  if (/; wv\)/.test(ua)) return 'una aplicación (WebView de Android)';
  return null;
}

/** Qué navegador es de verdad, no cuál dice ser. */
function queNavegador(ua: string, esIOS: boolean): string {
  if (esIOS) {
    // En iPhone TODO navegador usa WebKit por obligación de Apple: Chrome y Firefox
    // son Safari con otra cara, así que comparten sus políticas de audio al pie.
    if (/CriOS/.test(ua)) return 'Chrome en iPhone (por dentro es Safari)';
    if (/FxiOS/.test(ua)) return 'Firefox en iPhone (por dentro es Safari)';
    if (/EdgiOS/.test(ua)) return 'Edge en iPhone (por dentro es Safari)';
    return 'Safari';
  }
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/Firefox|FxiOS/.test(ua)) return 'Firefox';
  if (/OPR|Opera/.test(ua)) return 'Opera';
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome/.test(ua)) return 'Chrome';
  return 'otro';
}

/** La versión de iOS, que importa: las políticas de audio cambiaron entre versiones. */
function versionIOS(ua: string): string | null {
  const m = /OS (\d+)[_.](\d+)/.exec(ua);
  return m ? `${m[1]}.${m[2]}` : null;
}

/** El aparato y su motor. Lo que importa no es la marca: es qué reglas de audio aplica. */
function quienEs(): { texto: string; incrustado: string | null; esIOS: boolean } {
  const ua = navigator.userAgent;
  const esIOS =
    /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const esAndroid = /Android/.test(ua);
  const sistema = esIOS ? `iPhone/iPad${versionIOS(ua) ? ` (iOS ${versionIOS(ua)})` : ''}` : esAndroid ? 'Android' : 'escritorio u otro';
  const motor = esIOS ? 'WebKit' : /Firefox/.test(ua) ? 'Gecko' : 'Blink';
  return {
    texto: `${sistema} · ${queNavegador(ua, esIOS)} · motor ${motor}`,
    incrustado: navegadorIncrustado(ua),
    esIOS,
  };
}

async function correr(): Promise<void> {
  salida.replaceChildren();

  const quien = quienEs();
  fila('dato', 'Qué aparato y qué navegador', quien.texto);

  // La sospecha que más rinde, y va arriba de todo para que no se pase por alto.
  if (quien.incrustado) {
    fila(
      'mal',
      'Estás adentro de otra aplicación',
      `Esta página se abrió dentro de ${quien.incrustado}, no en el navegador del teléfono.`,
      'Esas ventanas recortan el audio de maneras que el navegador de verdad no. Abrí el enlace en Chrome o Safari y probá de nuevo: si ahí suena, la causa era esta.',
    );
  } else {
    fila('ok', 'Navegador de verdad', 'No estás adentro de otra aplicación.');
  }

  if (quien.esIOS) {
    fila(
      'aviso',
      'Es un iPhone, y eso trae una trampa',
      'La llave lateral de silencio apaga el audio de Web Audio.',
      'Aunque el volumen esté alto, si esa llave está en silencio el navegador no suena y no avisa. Es la causa más común de todas.',
    );
  }

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
