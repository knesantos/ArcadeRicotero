/**
 * El interruptor de la cinta (`UX-21`, `T-191`). La isla más chica del sitio.
 *
 * No decide nada sobre el sonido: eso es de `src/lib/sitio/cinta.ts`, que implementa
 * `ADR-04`. Acá solo se dibuja la estampa, se la mantiene al día y se traduce un toque en
 * una llamada. Es la separación que pide `UX-21` §8: el texto en `copy.ts`, el motor en el
 * módulo, y esto en el medio.
 *
 * ## Tres cosas que este archivo decide, y conviene que estén escritas
 *
 * 1. **El control lo crea JavaScript y no la plantilla.** Un interruptor de audio sin
 *    JavaScript no puede funcionar, así que dibujarlo en el HTML sería ofrecer un botón
 *    muerto a quien no tiene con qué usarlo. `D-14` al revés: no se le muestra a nadie una
 *    puerta que no abre. Sin JavaScript el sitio se ve exactamente igual, menos esto.
 *
 * 2. **No se pinta en las tres pantallas de tono grave.** Bulacio, Olavarría y la muerte
 *    del Indio. La lista está en `sitio/graves.ts` y el módulo del audio la vuelve a
 *    mirar por su cuenta: son dos candados sobre la misma puerta, a propósito. El
 *    hallazgo salió de una revisión adversarial —*"¿puede sonar en una pantalla donde
 *    sería una falta de respeto?"*— y la respuesta era que sí.
 *
 * 3. **Desvío declarado respecto de `UX-21` §7.** Esa hoja pide que el interruptor siga
 *    visible mientras se juega. En las pantallas de juego la cabecera vive adentro de
 *    `#portada`, que la isla de la partida **esconde** al empezar, así que el interruptor
 *    se va con ella y vuelve al terminar. Se puede arreglar —moviendo la cabecera afuera
 *    de `#portada` en las seis pantallas— pero eso es tocar el maquetado de seis juegos y
 *    no es de esta tarea. Queda anotado en
 *    `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-del-ciclo-11.md`. Mientras tanto
 *    no rompe nada: durante una partida con audio la cama está callada igual.
 */
import { CINTA } from '../lib/sitio/copy.ts';
import { esPantallaMuda, modoEnRuta } from '../lib/sitio/rutas-sonoras.ts';
import {
  alCambiarLaCinta,
  apagarCinta,
  cintaDisponible,
  estadoDeLaCinta,
  modoDeLaCinta,
  prenderCinta,
  proximaPieza,
  rearmarCinta,
  type EstadoCinta,
} from '../lib/sitio/cinta.ts';
import { type Pieza, alCambiarLaPieza, piezaSonando, sembrarRocola } from '../lib/sitio/rocola.ts';

/** Qué dice la estampa y qué dice el nombre accesible, por estado (`UX-21` §3). */
const ROTULO: Record<EstadoCinta, string> = {
  apagada: CINTA.apagada,
  sonando: CINTA.sonando,
  callada: CINTA.callada,
  bloqueada: CINTA.bloqueada,
};

/** El verbo va en el nombre accesible, no en la estampa: la estampa nombra un estado. */
const ACCION: Record<EstadoCinta, string> = {
  apagada: CINTA.prender,
  sonando: CINTA.apagar,
  callada: CINTA.apagar,
  bloqueada: CINTA.prender,
};

/**
 * El símbolo, dibujado con caracteres y sin un solo archivo nuevo (`UX-21` §2).
 *
 * Tres siluetas distintas, no la misma rellena con tres tintas: triángulo hueco cuando no
 * suena, lleno cuando suena, dos barras cuando está callada por otro sonido. Es la señal
 * no cromática que pide `UX-01`, y la que hace que esto se lea igual en blanco y negro.
 */
const SIMBOLO: Record<EstadoCinta, string> = {
  apagada: '▷',
  sonando: '▶',
  callada: '❚❚',
  bloqueada: '▷',
};

function pintar(boton: HTMLButtonElement, estado: EstadoCinta): void {
  boton.dataset.estado = estado;
  boton.setAttribute('aria-pressed', String(estado === 'sonando' || estado === 'callada'));
  boton.setAttribute('aria-label', ACCION[estado]);
  boton.replaceChildren();

  const simbolo = document.createElement('span');
  simbolo.className = 'cinta-simbolo';
  // El símbolo ya está dicho por la palabra de al lado: para un lector de pantalla es
  // ruido, y `aria-label` ya nombra la acción.
  simbolo.setAttribute('aria-hidden', 'true');
  simbolo.textContent = SIMBOLO[estado];

  const palabra = document.createElement('span');
  palabra.className = 'cinta-rotulo';
  palabra.textContent = ROTULO[estado];

  boton.append(simbolo, palabra);

  // `BLOQUEADA` sola se lee como que el sitio se rompió: una línea más nombra el hecho.
  const anterior = boton.parentElement?.querySelector('.cinta-motivo');
  anterior?.remove();
  if (estado === 'bloqueada') {
    const motivo = document.createElement('span');
    motivo.className = 'cinta-motivo';
    motivo.textContent = CINTA.porQueBloqueada;
    boton.after(motivo);
  }
}

/**
 * Lee la lista que la página imprimió en build y se la pasa a la rocola (`ADR-07.9`).
 *
 * **Sin pedido de red y sin `await`**: es un `<script type="application/json">` que ya está
 * en el documento. Eso es lo que permite que elegir el tema ocurra adentro del gesto, que es
 * lo único que el navegador acepta para dejar sonar algo.
 *
 * En las pantallas de juego y en las tres graves ese bloque **no existe** —`Base.astro` no lo
 * imprime—, así que acá no se siembra nada y la cinta se queda con la cama. Es el candado C:
 * el olvido cae del lado del silencio.
 */
function sembrarDesdeLaPagina(): void {
  if (modoEnRuta(location.pathname) !== 'rocola') return;
  const bloque = document.getElementById('piezas-rocola');
  if (!bloque?.textContent) return;
  try {
    const piezas = JSON.parse(bloque.textContent) as Pieza[];
    if (Array.isArray(piezas) && piezas.length > 0) sembrarRocola(piezas);
  } catch {
    // Un JSON que no parsea deja la cinta en modo cama, que suena igual y no cuesta nada.
    // Romper la isla entera por esto apagaría también el interruptor.
  }
}

/**
 * Dónde se cuelga la estampa.
 *
 * Si la pantalla ya tiene su renglón de cabecera, se suma ahí — es lo que pide `UX-21`
 * §1: el mismo lugar en todas, arriba, fuera de la zona del pulgar. La portada no tiene
 * cabecera (no hay a dónde volver desde la puerta), así que se le arma una fila propia,
 * vacía salvo por esto.
 */
function dondeVa(): HTMLElement | null {
  const cabecera = document.querySelector<HTMLElement>('.cabecera-sitio');
  if (cabecera) return cabecera;

  const contenedor = document.querySelector<HTMLElement>('.contenido-sitio, main');
  if (!contenedor) return null;

  const fila = document.createElement('div');
  fila.className = 'cabecera-sitio cabecera-sitio--solo-cinta';
  contenedor.prepend(fila);
  return fila;
}

function montar(): void {
  if (!cintaDisponible()) return;
  // El primer candado de los dos: la isla no se pinta donde no suena nada. El segundo lo
  // pone `cintaDisponible()` adentro del módulo, para que la preferencia guardada tampoco
  // pueda prenderla. Desde el ciclo 14 la lista incluye `/diagnostico-audio/` (`ADR-07.2`).
  if (esPantallaMuda(location.pathname)) return;

  // **La siembra va antes que todo lo demás** (`ADR-07.9`): sin ella `modoDeLaCinta()`
  // devuelve `cama`, y el primer toque prendería la cama en una pantalla donde podía sonar
  // un tema. Es texto que ya está en el documento, así que no hay pedido de red ni `await`.
  sembrarDesdeLaPagina();

  const lugar = dondeVa();
  if (!lugar) return;

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'cinta';
  pintar(boton, estadoDeLaCinta());

  boton.addEventListener('click', () => {
    const estado = estadoDeLaCinta();
    if (estado === 'sonando' || estado === 'callada') {
      apagarCinta();
      pintar(boton, estadoDeLaCinta());
      pintarRocola();
      return;
    }
    // Un segundo toque después de un bloqueo es un gesto nuevo de la persona, no un
    // reintento automático: `UX-21` §3.1 lo permite explícitamente y `ADR-04.4` solo
    // prohíbe que reintente el módulo por su cuenta.
    //
    // Sin argumento: prende **con lo que la ruta permita** (`ADR-07.9`). En una pantalla
    // que puede sonar, el primer toque ya pone un tema — un segundo botón para eso sería
    // un segundo toque para lo que el primero ya hace (`UX-26` §3.2).
    void prenderCinta().then((nuevo) => {
      pintar(boton, nuevo);
      pintarRocola();
    });
  });

  /*
   * El renglón de la rocola: qué tema suena, y el control para cambiarlo (`UX-26`).
   *
   * Va **debajo** del interruptor y no adentro: el botón es registro 3 —nombra un estado y
   * se calla— y el título de un tema no es un estado. Meterlo adentro de la estampa la
   * convertiría en un cartel que cambia de ancho cada diez segundos, arriba de todo y en la
   * cabecera.
   */
  const renglon = document.createElement('div');
  renglon.className = 'cinta-pieza';
  renglon.hidden = true;

  const queSuena = document.createElement('span');
  queSuena.className = 'cinta-suena';
  // La pieza cambia sola cada diez segundos: sin esto, quien no ve la pantalla no se entera
  // nunca de qué está sonando. `polite` y no `assertive`: no interrumpe lo que se esté
  // leyendo, que sería el sitio pisándole la lectura a alguien cada diez segundos.
  queSuena.setAttribute('aria-live', 'polite');

  const accion = document.createElement('button');
  accion.type = 'button';
  accion.className = 'cinta-accion';
  accion.addEventListener('click', () => {
    if (piezaSonando()) {
      // Ya hay una sonando: se saltea. Mueve bytes, y por eso pide este dedo.
      proximaPieza();
      return;
    }
    // Modo cama en una ruta que puede sonar: se sube de modo sin apagar nada. Es la
    // consecuencia de `ADR-07.8` —el rearme siempre arma en cama— y sin este botón el
    // único camino sería apagar y volver a prender.
    void prenderCinta('rocola').then(() => pintarRocola());
  });

  renglon.append(queSuena, accion);

  /** Pinta el renglón según la tabla de `UX-26` §4. Nada acá inventa un quinto estado. */
  function pintarRocola(): void {
    const estado = estadoDeLaCinta();
    const puede = modoDeLaCinta() === 'rocola';
    const pieza = piezaSonando();
    const prendida = estado === 'sonando' || estado === 'callada';

    if (!puede || !prendida) {
      renglon.hidden = true;
      return;
    }
    renglon.hidden = false;

    // El título se **congela** durante `callada` en vez de desaparecer: la pieza no cambió,
    // solo dejó de oírse porque algo más importante está sonando. Borrarlo sería mentir por
    // omisión, como si la rocola se hubiera olvidado de qué estaba poniendo. El `❚❚` del
    // interruptor ya dice "no se oye ahora".
    queSuena.textContent = pieza ? CINTA.suena(pieza.titulo, pieza.entero) : '';

    // Saltear una pieza que no se puede oír gasta bytes sin ningún beneficio, así que el
    // control desaparece mientras la cinta está callada.
    const ofreceSaltar = pieza !== null && estado === 'sonando';
    const ofrecePoner = pieza === null;
    accion.hidden = !ofreceSaltar && !ofrecePoner;
    accion.textContent = pieza ? CINTA.otroTema : CINTA.ponerTema;
  }

  // El módulo avisa cuando la cama se calla sola porque arrancó un fragmento. Sin esto,
  // la estampa diría SONANDO mientras no suena, y la persona tocaría el interruptor
  // pensando que se rompió.
  alCambiarLaCinta((estado) => {
    pintar(boton, estado);
    pintarRocola();
  });

  // Y este es el aviso que `UX-21` no tenía y que `UX-26` encontró leyendo el contrato:
  // pasar de un tema al siguiente **no cambia el estado** —sigue `sonando`—, así que sin
  // esto el renglón mostraría para siempre el título de la primera pieza.
  alCambiarLaPieza(() => pintarRocola());
  pintarRocola();

  /*
   * **La preferencia tiene que significar algo cuando se cambia de pantalla.**
   *
   * Con `ADR-03` el tránsito es entre documentos: cada pantalla es un contexto de audio
   * nuevo y ningún navegador deja sonar nada sin un gesto. Si nadie llama a esto, alguien
   * que prendió la cinta en la portada la ve apagada en cada juego y tiene que volver a
   * prenderla en cada pantalla — que es peor que no tener preferencia.
   *
   * `rearmarCinta()` no prende nada: arma un escucha **de un solo uso** que espera el primer
   * toque o la primera tecla de la página. No es autoreproducción, porque la persona ya
   * declaró con el dedo que la quiere; es lo mínimo para que esa declaración sobreviva a un
   * enlace. Si la preferencia está apagada, no registra nada.
   *
   * Faltaba, y lo encontró una refutación adversarial: `ADR-04.4` lo promete por escrito y
   * la función existía sin que la llamara nadie en todo el sitio.
   */
  rearmarCinta();

  // La cinta va **última** en el renglón, y eso es lo que hace cumplir la prioridad que
  // fija `UX-21` §1: *"si los tres elementos de la cabecera no entran en un renglón sin
  // apretarse, el que cede el renglón propio es el interruptor"*.
  //
  // Medido a 375 px antes de escribir esto: `.volver` + la estampa + `.marca-chica` suman
  // 369 px contra 343 disponibles, así que **no entran**. Con la cinta al final y el
  // renglón en `flex-wrap`, la que baja a la segunda línea es ella sola; con la cinta en el
  // medio, lo que se partía en dos era la salida de la pantalla.
  lugar.append(boton);
  // El renglón de la rocola se cuelga **después** de que el botón esté en el árbol: `after()`
  // sobre un nodo suelto no hace nada y no avisa, así que hacerlo antes dejaba el renglón
  // construido, vivo y en ninguna parte. Se descubrió mirando el DOM, no leyendo.
  boton.after(renglon);
}

montar();
