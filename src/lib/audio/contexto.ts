/**
 * El `AudioContext` compartido del sitio (`ADR-04.2`).
 *
 * ## Por qué el contexto vive acá, y no adentro de un motor
 *
 * Hasta el ciclo 11 lo construía `Reproductor.despertar()` y vivía privado adentro de esa
 * clase. Se mudó acá cuando apareció un segundo interesado —la cama de cinta, que se sacó
 * del sitio el 2026-10-01— y se queda acá porque hoy los interesados siguen siendo dos: el
 * motor del reveal (`tema/audio.ts`) y los efectos de Skayboy (`skayboy/sonido.ts`). La
 * salida de un teléfono no es un recurso que se pida dos veces sin pensarlo:
 *
 * 1. **Un segundo contexto duplica un ciclo de vida que costó dos defectos reportados por
 *    el usuario aprender a manejar** — nace `suspended` en el celular, cae en `interrupted`
 *    cuando entra una llamada, y no se destraba con `resume()` solo. Todo eso habría que
 *    volver a escribirlo, y el que lo escriba de nuevo se come los mismos dos.
 * 2. **Cuántos contextos simultáneos tolera un iPhone no lo tiene fichado nadie.** Con uno
 *    solo la pregunta no se hace, que es la única forma honesta de no contestarla.
 *
 * Ningún motor es dueño: **todos lo piden prestado.**
 *
 * ## Este archivo no importa nada, y eso es la mitad de su trabajo
 *
 * `D-29`: una isla que arrastra un `node:*` muere al cargar, y con la isla muerta la
 * pantalla queda dibujada y sin responder. `src/lib/islas.test.ts` recorre el grafo de
 * importaciones desde `src/scripts/` para que no vuelva a pasar. Un módulo hoja cumple esa
 * regla por construcción: **lo que nunca importa, nunca arrastra.** No es prolijidad, es la
 * única garantía que no depende de que alguien se acuerde.
 *
 * ## Y todo lo mira adentro de la función, nunca al evaluarse
 *
 * `window` se lee cuando alguien llama, no cuando el módulo se carga. Las pruebas instalan
 * sus dobles **después** de importar, y un módulo que se queda con lo que vio al nacer no
 * se puede probar — que en este proyecto equivale a no existir.
 */

/** Los navegadores viejos de iOS todavía lo sirven con prefijo. */
type ConstructorDeContexto = new () => AudioContext;

let ctx: AudioContext | null = null;
/** Si ya sonó el buffer mudo que destraba el audio en los celulares. */
let desbloqueada = false;

/**
 * El contexto compartido. Lo crea el primero que lo pide, **desde adentro de un gesto**.
 *
 * Quién llega primero no importa y no se decide acá: en "Adiviná el tema" lo crea
 * `despertar()` en el toque de "Empezá"; en Skayboy, `despertarSalida()` en el primer toque
 * de la partida.
 *
 * Devuelve `null` si este navegador no tiene Web Audio o si se negó a construirlo. No es un
 * error: el motor del reveal tiene su camino de repuesto con `<audio>`, y Skayboy se juega
 * en silencio.
 */
export function contextoDeAudio(): AudioContext | null {
  if (ctx) return ctx;
  if (typeof window === 'undefined') return null;
  const Ctor = (window.AudioContext ??
    (window as unknown as { webkitAudioContext?: ConstructorDeContexto }).webkitAudioContext) as
    | ConstructorDeContexto
    | undefined;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
  return ctx;
}

/**
 * El que ya existe, sin crear ninguno. Para mirar sin tocar.
 *
 * Lo usan los efectos de Skayboy desde el bucle del juego: si acá no hay nada, no suenan.
 * Preguntar con `contextoDeAudio()` sería construir un contexto fuera de un gesto, o sea
 * empezar a sonar sin que nadie lo haya pedido, que es justo lo que `ADR-04.4` prohíbe.
 */
export function contextoVivo(): AudioContext | null {
  return ctx;
}

/**
 * El desbloqueo de los celulares, que **no es lo mismo que `resume()`**.
 *
 * En iOS un contexto recién creado nace `suspended`, y hay versiones donde `resume()` solo
 * no alcanza: queda listo recién cuando **sonó algo** desde adentro de un gesto de la
 * persona. Un buffer de una muestra en silencio es ese algo.
 *
 * La misma receta vive en `Reproductor.desbloquear()` (`src/lib/tema/audio.ts`), y está
 * repetida a propósito: `ADR-04.2` dice con todas las letras que el `despertar()` del motor
 * no se toca, porque es la parte que arregló el celular del usuario. Son dos puertas de
 * entrada al mismo truco, no una copia que alguien olvidó borrar. Si algún día se unifican,
 * se unifican desde acá y con `audio.test.ts` verde.
 */
function desbloquear(salida: AudioContext): void {
  if (desbloqueada) return;
  try {
    const mudo = salida.createBuffer(1, 1, salida.sampleRate);
    const fuente = salida.createBufferSource();
    fuente.buffer = mudo;
    fuente.connect(salida.destination);
    fuente.start(0);
    desbloqueada = true;
  } catch {
    // Un navegador que no deja ni esto tampoco va a dejar sonar nada más: el que llamó se
    // entera mirando el estado que devolvemos, no con una excepción.
  }
}

/**
 * `resume()` más el buffer mudo. **Solo desde adentro de un gesto.**
 *
 * Devuelve el estado en el que quedó la salida, o `null` si no hay Web Audio. Quien llama
 * decide qué hacer con eso. Reintentar contra la política de autoreproducción fuera de un
 * gesto es el truco que esa política existe para impedir: el próximo intento lo trae el
 * próximo toque de la persona, no un temporizador.
 *
 * El orden de adentro no es casual: se pide volver primero y se destraba **sin esperar**,
 * porque de este lado del `await` todavía estamos adentro del gesto y del otro ya no. Un
 * buffer mudo disparado después de esperar la promesa es un buffer mudo fuera del gesto, y
 * en iOS eso no vale nada.
 */
export async function despertarSalida(): Promise<AudioContextState | null> {
  const salida = contextoDeAudio();
  if (!salida) return null;
  let volviendo: Promise<void> | null = null;
  if (salida.state !== 'running') {
    try {
      // El `.catch` no es prolijidad: un navegador que rechaza el `resume` dejaba una
      // promesa sin capturar, y eso es ruido en la consola de la gente por algo que acá ya
      // está manejado — el estado que devolvemos lo dice.
      volviendo = salida.resume().catch(() => {});
    } catch {
      volviendo = null;
    }
  }
  desbloquear(salida);
  if (volviendo) await volviendo;
  return salida.state;
}

/**
 * Deja el módulo como recién cargado. **Solo para las pruebas** (`ADR-04.2`).
 *
 * Sin esto los casos se contaminan entre sí y el que se rompe es el motor: `audio.test.ts`
 * instala dobles globales y arma un `Reproductor` nuevo por caso, así que un contexto que
 * sobrevive al caso anterior hace que `assert.equal(e.registro.mudos, 1)` mida otra cosa —
 * y peor, la mide bien un rato y mal después, que es el defecto que nadie encuentra.
 *
 * **No cierra el contexto a propósito.** `close()` devuelve una promesa que acá no espera
 * nadie, y el contexto de una prueba es un doble que ni siquiera lo tiene. Soltar la
 * referencia alcanza para lo único que esta función promete.
 */
export function reiniciarAudioParaPruebas(): void {
  ctx = null;
  desbloqueada = false;
}
