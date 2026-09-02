/**
 * El `AudioContext` compartido del sitio (`ADR-04.2`).
 *
 * ## Por qué el contexto se mudó acá, y no se queda adentro del motor
 *
 * Hasta hoy lo construía `Reproductor.despertar()` y vivía privado adentro de esa clase.
 * Alcanzaba mientras el único que hacía ruido era el reveal. Con la cama de cinta hay un
 * segundo interesado, y la salida de un teléfono no es un recurso que se pueda pedir dos
 * veces sin pensarlo:
 *
 * 1. **Un segundo contexto duplica un ciclo de vida que costó dos defectos reportados por
 *    el usuario aprender a manejar** — nace `suspended` en el celular, cae en `interrupted`
 *    cuando entra una llamada, y no se destraba con `resume()` solo. Todo eso habría que
 *    volver a escribirlo, y el que lo escriba de nuevo se come los mismos dos.
 * 2. **Un contexto no puede callar al otro.** La regla de convivencia de `ADR-04.3` —cuando
 *    suena un fragmento, la cama se calla— se apoya en que los dos cuelgan de la misma
 *    salida y en que hay un solo lugar donde preguntar si está ocupada. Ese lugar es este.
 * 3. **Cuántos contextos simultáneos tolera un iPhone no lo tiene fichado nadie.** Con uno
 *    solo la pregunta no se hace, que es la única forma honesta de no contestarla.
 *
 * Ni el motor de fragmentos ni la cama son dueños: **los dos lo piden prestado.** La
 * dirección es única —`tema/audio.ts` → `audio/contexto.ts` ← `sitio/cinta.ts`— y si algún
 * día se cruzan, la convivencia pasa a depender de quién cargó primero, que es otra manera
 * de decir que deja de estar decidida.
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

/**
 * Un pedido de la salida que sigue vivo.
 *
 * `quien` no lo lee nadie hoy y está a propósito: cuando algún día la cama quede muda sin
 * motivo, el que abra esto va a querer saber **qué** la dejó muda, y un contador no se lo
 * puede decir.
 */
interface Pedido {
  readonly quien: string;
  readonly corte: ReturnType<typeof setTimeout>;
}

let ctx: AudioContext | null = null;
/** Si ya sonó el buffer mudo que destraba el audio en los celulares. */
let desbloqueada = false;
let ultimoPedido = 0;
/**
 * Los pedidos vivos.
 *
 * **Es un mapa y no un número, y esa es la razón por la que el contador nunca queda
 * negativo: no hay contador.** Soltar dos veces el mismo pedido borra una entrada que ya no
 * está, que es un no-op; soltar uno que nunca se tomó, también. Un entero con `++` y `--`
 * puede acumular una deuda invisible que después se come el próximo pedido legítimo — y el
 * síntoma sería una cama que se quedó muda sin que nadie pueda decir desde cuándo.
 */
const pedidos = new Map<number, Pedido>();
const oyentes = new Set<(ocupada: boolean) => void>();

/**
 * El contexto compartido. Lo crea el primero que lo pide, **desde adentro de un gesto**.
 *
 * Quién llega primero no importa y no se decide acá: si la persona prende la cinta en la
 * portada, lo crea la cinta y el juego se lo encuentra corriendo; si entra derecho al
 * juego, lo crea `despertar()` como siempre y la cinta se cuelga del que hay.
 *
 * Devuelve `null` si este navegador no tiene Web Audio o si se negó a construirlo. No es un
 * error: el motor tiene su camino de repuesto con `<audio>` y la cama simplemente no se
 * ofrece.
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
 * Lo usa la cama al cargar una página con la preferencia guardada: si acá no hay nada, se
 * queda quieta. Preguntar con `contextoDeAudio()` sería construir un contexto fuera de un
 * gesto, o sea empezar a sonar sin que nadie lo haya pedido, que es justo lo que `ADR-04.4`
 * prohíbe.
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
    // Un navegador que no deja ni esto tampoco va a dejar la cama: el que llamó se entera
    // mirando el estado que devolvemos, no con una excepción.
  }
}

/**
 * `resume()` más el buffer mudo. **Solo desde adentro de un gesto.**
 *
 * Devuelve el estado en el que quedó la salida, o `null` si no hay Web Audio. Quien llama
 * decide qué hacer con eso: la cama, si no quedó `running`, se declara `bloqueada`, no
 * guarda la preferencia y desarma el grafo — **un intento y nada más**. Reintentar contra la
 * política de autoreproducción, o dejar armado un escucha del próximo toque, es el truco que
 * esa política existe para impedir.
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

/** Les avisa a los oyentes que la salida cambió de mano. */
function avisar(ocupada: boolean): void {
  // Sobre una copia: un oyente que se da de baja mientras se le avisa es normal —la cama se
  // apaga en medio de una ráfaga— y no puede romperle el aviso a los demás. Y con `catch`
  // por oyente: el motor de fragmentos no se cae porque la atmósfera tenga un defecto.
  for (const oyente of [...oyentes]) {
    try {
      oyente(ocupada);
    } catch {
      // El que escucha se arregla solo.
    }
  }
}

function soltar(id: number): void {
  const pedido = pedidos.get(id);
  if (!pedido) return; // ya se soltó, o nunca existió: soltar de más no descuenta de más
  clearTimeout(pedido.corte);
  pedidos.delete(id);
  if (pedidos.size === 0) avisar(false);
}

/**
 * El motor avisa que va a usar la salida. Devuelve cómo soltarla (`ADR-04.3`, oído 1).
 *
 * **La pregunta que contesta no es "por dónde sale el sonido" sino "hay algo sonando".** Esa
 * diferencia es todo el apartado: el motor de fragmentos tiene dos caminos y el de repuesto
 * usa un `<audio>` que nunca entra al documento, así que ni un `AnalyserNode` colgado del
 * grafo ni un escucha de eventos del documento lo verían. El pedido no mira: le avisan.
 *
 * `topeSeg` es la red de seguridad y copia una que ya existe en el motor —el corte por
 * temporizador del camino de repuesto, `limite + 5`—. **Un pedido que se filtra dejaría la
 * cama muda para siempre y sin síntoma**, que es la peor forma de romperse: no molesta a
 * nadie hasta que alguien nota que la atmósfera nunca volvió. Se suelta solo.
 */
export function tomarLaSalida(quien: string, topeSeg: number): () => void {
  const id = ++ultimoPedido;
  const estabaLibre = pedidos.size === 0;
  const corte = setTimeout(() => soltar(id), Math.max(0, topeSeg) * 1000);
  pedidos.set(id, { quien, corte });
  if (estabaLibre) avisar(true);
  // Idempotente: la primera llamada suelta, las que sigan no encuentran nada que soltar.
  return () => soltar(id);
}

/** Si hay algo sonando ahora mismo. Barato: no crea nada, no toca el contexto. */
export function salidaOcupada(): boolean {
  return pedidos.size > 0;
}

/**
 * Para que la cama se entere de que tiene que callarse. Devuelve cómo darse de baja.
 *
 * Avisa **en el mismo cuadro** en que la salida cambia de mano, sin encuesta de por medio:
 * ni `setInterval`, ni `requestAnimationFrame`. La bajada de la cama son 20 ms y el primer
 * escalón del reveal dura 100; con un sondeo en el medio, el escalón que `CTR-01.5` existe
 * para que suene honesto sonaría con la cama encima.
 */
export function alCambiarLaSalida(oyente: (ocupada: boolean) => void): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

/**
 * Deja el módulo como recién cargado. **Solo para las pruebas** (`ADR-04.2`).
 *
 * Sin esto los casos se contaminan entre sí y el que se rompe es el motor: `audio.test.ts`
 * instala dobles globales y arma un `Reproductor` nuevo por caso, así que un contexto que
 * sobrevive al caso anterior hace que `assert.equal(e.registro.mudos, 1)` mida otra cosa —
 * y peor, la mide bien un rato y mal después, que es el defecto que nadie encuentra.
 *
 * También apaga los cortes por temporizador que quedaron armados: un `setTimeout` de quince
 * segundos vivo al terminar una prueba deja el proceso colgado esperándolo.
 *
 * **No cierra el contexto a propósito.** `close()` devuelve una promesa que acá no espera
 * nadie, y el contexto de una prueba es un doble que ni siquiera lo tiene. Soltar la
 * referencia alcanza para lo único que esta función promete.
 */
export function reiniciarAudioParaPruebas(): void {
  for (const pedido of pedidos.values()) clearTimeout(pedido.corte);
  pedidos.clear();
  oyentes.clear();
  ctx = null;
  desbloqueada = false;
}
