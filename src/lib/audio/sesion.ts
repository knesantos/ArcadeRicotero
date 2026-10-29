/**
 * La llave de silencio del iPhone, y cómo se le pide que no apague el juego (`D-66`).
 *
 * ## El defecto
 *
 * En un iPhone con la llave lateral en silencio, "Adiviná el tema" no suena. El volumen puede
 * estar al máximo: la llave manda y no avisa. Fue la causa de la partida entera que el usuario
 * jugó sin escuchar un tema, y hasta acá lo único que se podía hacer era decírselo.
 *
 * La causa está en el código de WebKit (`RES-200`): **Web Audio sale con la sesión de los
 * efectos** (`AmbientSound`, la categoría que la llave apaga) y `<audio>` sale con la de la
 * música (`MediaPlayback`, la que no). Por eso el tema entero de la revelación
 * (`<audio controls>`) se oía y el fragmento no. El juego es de oído: para él, la llave no
 * puede mandar.
 *
 * ## La salida: pedirle al navegador la sesión de la música
 *
 * Safari expone `navigator.audioSession` desde la 16.4 (la Audio Session API, borrador de la
 * W3C, `RES-201`). Con `type = 'playback'` la página entera, Web Audio incluido, pasa a la
 * categoría de la música, y la llave deja de apagarla. Es el único valor que sirve:
 * `ambient` y `transient` siguen siendo la categoría de los efectos, y `play-and-record`
 * pone el teléfono en modo de grabar.
 *
 * **Se pide antes de despertar el contexto**, adentro del toque de "Empezá". El código de
 * WebKit dice que vale en cualquier momento (`RES-202`), pero nadie lo probó después, y
 * pedirlo antes cuesta cero: el primer fragmento ya sale por la sesión nueva.
 *
 * En un iPhone que no la tiene —tope iOS 15, o 16.3 y menos (`RES-205`)— la llave sigue
 * mandando, y el aviso de la portada lo sigue diciendo. El repuesto de esos teléfonos (un
 * `<audio>` mudo sonando en loop, `RES-204`) se descartó en `D-66`: no se puede probar acá,
 * y hay un reporte de que en 16.3 dejaba Web Audio sonando un segundo y nada más.
 *
 * ## Lo que cuesta, dicho de frente
 *
 * La sesión de la música no se mezcla: si la persona venía escuchando algo en otra
 * aplicación, eso se corta cuando arranca el juego (`RES-201`). Es lo mismo que ya hacía el
 * tema entero de la revelación, que siempre salió por esa sesión. En un juego de adivinar
 * temas de oído es lo que corresponde —con otra música de fondo no se puede jugar—, pero es
 * un cambio, y por eso esto **no lo pide el sitio entero**: los efectos de Skayboy siguen
 * como estaban, mezclándose con lo que suene y callándose con la llave, que es lo que se
 * espera de los ruiditos de un juego.
 *
 * Y nada suena sin que la persona lo pida: cada fragmento sale de un toque en "Escuchá", y
 * el tema entero, del suyo. Saltar la llave no le mete ruido a nadie que no lo buscó.
 *
 * ## Este archivo no importa nada
 *
 * Mismo motivo que `contexto.ts` (`D-29`): una hoja no arrastra nada al navegador. Y no mira
 * `navigator` al cargarse: lo recibe al llamarse, con el global como valor por defecto, para
 * que las pruebas le pasen el suyo —en Node `navigator` existe y no se puede pisar.
 */

/** Lo que se usa de la Audio Session API. TypeScript todavía no la trae en `lib.dom`. */
interface SesionDeAudio {
  type: string;
}

/**
 * La sesión de este navegador, o `null` si no la expone: Chrome y Firefox fuera del iPhone
 * (`RES-203`). Ahí asignarla sin mirar tira `TypeError`, por eso se mira primero.
 */
function sesionDe(nav: unknown): SesionDeAudio | null {
  if (!nav || typeof nav !== 'object') return null;
  const sesion = (nav as { audioSession?: unknown }).audioSession;
  if (!sesion || typeof sesion !== 'object' || !('type' in sesion)) return null;
  return sesion as SesionDeAudio;
}

/** El navegador del que llama, si hay uno. Leído al llamar, nunca al cargar. */
function navegadorActual(): unknown {
  return typeof navigator === 'undefined' ? null : navigator;
}

/**
 * Le pide al navegador que el sonido de esta página no lo apague la llave de silencio.
 *
 * **Adentro del gesto y antes de `despertar()`.** Devuelve `true` si el pedido quedó puesto.
 * `false` no es un error: es un navegador sin la API —Chrome en Android, Firefox, un iPhone
 * viejo—, donde o no hay llave o no hay con qué pedirlo, y el juego sigue igual que antes.
 */
export function sonarAunqueEsteEnSilencio(nav: unknown = navegadorActual()): boolean {
  const sesion = sesionDe(nav);
  if (!sesion) return false;
  try {
    if (sesion.type !== 'playback') sesion.type = 'playback';
  } catch {
    // WebKit tira `InvalidStateError` si la página se quedó sin documento (`RES-202`). Un
    // navegador que rechaza el valor queda como estaba, y el juego suena como antes.
    return false;
  }
  return sesion.type === 'playback';
}

/**
 * Si en este navegador la llave de silencio todavía puede apagar el juego.
 *
 * Es la pregunta que decide si el aviso de la llave se muestra: con la sesión de la música
 * pedida, el aviso diría algo que ya no es cierto, y un rótulo que miente es justo lo que este
 * proyecto no se permite (`D-14`). **No toca nada**: solo mira si el navegador tiene con qué
 * saltarla.
 */
export function laLlaveManda(nav: unknown = navegadorActual()): boolean {
  return sesionDe(nav) === null;
}
