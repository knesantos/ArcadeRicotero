/**
 * La noche de "¿Qué tipo de ricotero sos?" (`US-06`, `D-57`). Isla de `dos-ejes.astro` y de
 * sus cuatro postales (`dos-ejes/[cu].astro`).
 *
 * **Lo que este archivo no hace, y es deliberado:** no cuenta nada en pantalla. No hay
 * puntaje, no hay aciertos, no hay barra de cuánto te inclinaste hacia un extremo. Los únicos
 * números son el folio de la hoja (`3 de 10`), que es orientación y no medición. La regla
 * está antes que la interfaz: `resolverCuadrante` devuelve tres campos de texto y ninguno
 * numérico (`CTR-08.6`), así que el conteo por eje no llega hasta acá.
 *
 * ## El toque (`D-57` punto 12)
 *
 * Hasta el ciclo 18 el clic avanzaba en el mismo tick y las opciones nuevas caían en el mismo
 * lugar: un doble toque contestaba la pregunta siguiente sin leerla, y corrompía en silencio
 * el único resultado del juego. Ahora el toque **bloquea** las dos opciones, marca la elegida
 * y la hoja siguiente llega a los `--pausa-eleccion`, un token de espera que el corte de
 * movimiento reducido no apaga: es lo que tapa el doble toque.
 *
 * ## Lo que el teclado y el lector de pantalla reciben (`D-57` punto 13)
 *
 * El foco va al enunciado de cada hoja y al nombre del resultado (el mismo `enfocar()` del
 * quiz), las opciones van en `role=group` con el enunciado de nombre, y una región viva dice
 * el momento y el folio. Con teclado, 1 y 2 eligen y Retroceso vuelve a la anterior.
 *
 * Durante la pausa las opciones quedan con `aria-disabled` y no con `disabled` (`UX-36` §4.3):
 * con `disabled` el botón tocado pierde el foco y el lector no llega a decir que quedó
 * apretado. La región viva es **una sola y está en el HTML de la página** (`#ejes-anuncio`),
 * afuera de lo que esta isla vacía: una región que nace junto con su texto no se anuncia de
 * forma fiable.
 *
 * ## La noche se ve (ronda de pulida de los juegos, 2026-11-18)
 *
 * Arriba de la hoja hay **un lugar**: una tira dibujada —el barrio, la ruta, el paredón, el
 * escenario, el barrio de vuelta— por la que la mirada camina un tramo con cada hoja
 * (`lib/dos-ejes/noche.ts`), con la luna cruzando el cielo. Cada momento tiene algo vivo que
 * dura lo que dura el momento: el fuego de la previa, los postes que pasan en la ida, la gente
 * que salta cuando suena. La vuelta va quieta.
 *
 * Elegir tiene respuesta: la casilla de la opción se llena, y la marca vuela a su casilla en
 * la fila de la noche. La hoja contestada se va de costado, como una página que se pasa, y la
 * que sigue ya estaba abajo.
 *
 * **Nada de eso mide** (`BR-17`): el lugar, la luna y las casillas avanzan igual con cualquier
 * respuesta. Son el folio, dibujado. La isla sigue sin contar polos.
 */

import {
  sortearPartida,
  resolverCuadrante,
  disposicion,
  planoFijo,
  relacion,
  type Banco,
  type Cuadrante,
  type ItemServido,
  type Polo,
} from '../lib/dos-ejes/partida.ts';
import {
  PANTALLA_0,
  PARTIDA,
  RESULTADO,
  CONTRASTE,
  POSTAL,
  EJES,
  POLOS,
  lineaQueNombra,
  selloDePolos,
  textoDelPlano,
} from '../lib/dos-ejes/copy.ts';
import { rutaDeTarjeta, rutaDePieza, slugDe } from '../lib/dos-ejes/arte.ts';
import { leerDesafio } from '../lib/desafio.ts';
import { GUINOS, TIRA, lunaDe, paradaDe } from '../lib/dos-ejes/noche.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { botonCompartir } from './compartir.ts';
import { armarInterruptorDeRuidos, duracionDe, estampar, volar } from './jugo.ts';

/** El nombre con el que este juego firma sus desafíos (`ADR-02`). */
const JUEGO = 'dos-ejes';

const $ = <T extends HTMLElement>(sel: string): T => document.querySelector<T>(sel)!;

const banco = JSON.parse($('#banco').textContent ?? '{}') as Banco;

const app = $('#app');
const zonaInicio = $('#inicio');
const zonaPregunta = $('#pregunta');
const zonaResultado = $('#resultado');
/** La región viva de la página: se escribe, nunca se crea (`UX-36` §8.2). */
const anuncio = $('#ejes-anuncio');

let ronda: ItemServido[] = [];
let paso = 0;
const elegidos: Polo[] = [];
/** Lo que ya salió en esta visita: "Empezá otra noche" no lo repite (`BR-37`). Sin `localStorage`. */
const vistos = new Set<string>();
/** Mientras corre la pausa, nada más entra: es lo que cierra el doble toque. */
let bloqueado = false;
/** La tarjeta del resultado, bajada al pintarlo: así se comparte en el mismo toque. */
let tarjeta: File | null = null;
/** El momento de la hoja de antes: el sello entra solo cuando cambia (`UX-36` §4.5). */
let momentoAnterior: string | undefined;
/** El lugar de la noche: se arma una vez por partida y cada hoja lo corre un tramo. */
let lugar: HTMLElement | null = null;
/** Donde se apilan las hojas: la que se va queda un instante encima de la que llega. */
let pila: HTMLElement | null = null;
/** El pie de la partida (volver, teclas, ruidos), que se rehace con cada hoja. */
let pie: HTMLElement | null = null;

/**
 * Los guiños que ya están en el lugar: por hoja, **de qué lado** se tocó (0, la opción de
 * arriba; 1, la de abajo). No guarda el polo, y el orden de las opciones se sortea: de acá no
 * sale ninguna medida (`BR-17`).
 */
const lados: (0 | 1)[] = [];
/** Los relojes del pase de momento, para poder cortarlos si se sale de la partida. */
let relojes: number[] = [];

/** Cómo llega una hoja: abre la noche, sigue a la anterior, o se vuelve a ella. */
type Pase = 'abre' | 'sigue' | 'vuelve';

/**
 * El cuadrante de quien mandó el enlace, si vino uno válido. La postal lo trae puesto en
 * `data-desafio`; los enlaces de antes (`?g=dos-ejes&r=CU-n`) lo traen en la dirección. El
 * nombre que se muestra es **el del banco**, nunca el de la URL.
 */
const suyo: Cuadrante | undefined = (() => {
  const id = app.dataset['desafio'] ?? (() => {
    const d = leerDesafio(location.search, JUEGO);
    return d?.forma === 'identidad' ? d.identidad : undefined;
  })();
  return id ? banco.cuadrantes.find((c) => c.id === id) : undefined;
})();

function el(tag: string, clase: string, texto?: string): HTMLElement {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function enfocar(destino: HTMLElement): void {
  // -1 lo hace enfocable por código sin meterlo en el orden de tabulación: el foco llega
  // ahí cuando la pantalla cambia, pero nadie tiene que pasar por él tabulando.
  destino.tabIndex = -1;
  destino.focus({ preventScroll: false });
}

/** La pausa de la elección, en milisegundos, leída del token (`tokens.css`). */
const pausa = (): number => duracionDe('--pausa-eleccion');

const momentoDe = (id: string) => banco.momentos.find((m) => m.id === id)!;

/* ------------------------------------------------------------------
   El lugar de la noche.
   ------------------------------------------------------------------ */

/**
 * Arma el lugar: el cielo de mármol, la luna, lo de lejos, la tira del camino en sus cuatro
 * pasadas de tinta y lo que vive en cada momento. Todo es para el ojo —va sin voz para el
 * lector de pantalla— menos el cartel, que lleva la línea que canta.
 *
 * Las piezas son cajas vacías: el dibujo llega como máscara desde `juego.css` y la tinta desde
 * `tokens.css`. Lo que se mueve es `transform` y `opacity`, en animaciones y transiciones de
 * CSS; acá solo se escriben la parada, la luna y el momento.
 */
function armarLugar(): HTMLElement {
  const caja = el('div', 'ejes-lugar');
  const arte = el('div', 'ejes-lugar-arte');
  arte.setAttribute('aria-hidden', 'true');

  const luna = el('span', 'ejes-lugar-luna-viaje');
  luna.append(el('span', 'ejes-lugar-luna'));

  const tira = el('span', 'ejes-lugar-tira');
  const haces = el('span', 'ejes-lugar-haces');
  haces.append(el('i', 'ejes-lugar-haz'), el('i', 'ejes-lugar-haz'), el('i', 'ejes-lugar-haz'));
  // Lo que sale del parlante de la vereda: tres ondas que se prenden de a una.
  const ondas = el('span', 'ejes-lugar-ondas');
  ondas.append(el('i', 'ejes-lugar-onda'), el('i', 'ejes-lugar-onda'), el('i', 'ejes-lugar-onda'));
  tira.append(
    haces,
    el('span', 'ejes-lugar-pasada ejes-lugar-sombra'),
    el('span', 'ejes-lugar-pasada ejes-lugar-tinta'),
    el('span', 'ejes-lugar-pasada ejes-lugar-cuero'),
    el('span', 'ejes-lugar-pasada ejes-lugar-llama'),
    el('span', 'ejes-lugar-fuego'),
    ondas,
    el('span', 'ejes-lugar-guinos'),
  );

  const micro = el('span', 'ejes-lugar-micro');
  const cajaDelMicro = el('span', 'ejes-lugar-micro-caja');
  cajaDelMicro.append(el('i', 'ejes-lugar-micro-sombra'), el('i', 'ejes-lugar-micro-tinta'));
  micro.append(cajaDelMicro);

  const gente = el('span', 'ejes-lugar-gente');
  const salta = el('span', 'ejes-lugar-gente-salta');
  salta.append(el('i', 'ejes-lugar-gente-sombra'), el('i', 'ejes-lugar-gente-cuero'), el('i', 'ejes-lugar-gente-trapos'));
  gente.append(salta);

  arte.append(el('span', 'ejes-lugar-estrellas'), el('span', 'ejes-lugar-alba'), luna, el('span', 'ejes-lugar-lejos'), tira, el('span', 'ejes-lugar-postes'), micro, gente);

  // El cartel del momento: el sello con su nombre y, debajo, la línea que canta. El nombre va
  // sin voz (lo dicen el sello de la hoja y el anuncio); la línea no, que es texto de la partida.
  const cartel = el('div', 'ejes-lugar-cartel');
  const sello = el('span', 'ejes-lugar-sello');
  sello.setAttribute('aria-hidden', 'true');
  cartel.append(sello, el('p', 'ejes-lugar-canta'));
  caja.append(arte, cartel);
  return caja;
}

/** Corre la tira y la luna a la hoja `paso`, y pone lo que vive en ese momento. */
function caminar(momentoId: string): void {
  if (!lugar) return;
  const hojas = ronda.length;
  const porMomento = Math.max(1, Math.round(hojas / banco.momentos.length));
  lugar.style.setProperty('--parada', String(paradaDe(paso, porMomento) / TIRA.alto));
  const luna = lunaDe(paso, hojas);
  lugar.style.setProperty('--luna-x', String(luna.x));
  lugar.style.setProperty('--luna-y', String(luna.y));
  for (const m of banco.momentos) lugar.classList.toggle(`ejes-lugar--${m.id}`, m.id === momentoId);
}

/**
 * Cambia el cartel al momento nuevo. `cae`: el sello cae con su ruido y la línea entra
 * detrás; sin eso (al volver a un momento) el cartel cambia y nada más.
 */
function rotular(momento: { nombre: string; canta: string }, cae: boolean): void {
  if (!lugar) return;
  const cartel = lugar.querySelector<HTMLElement>('.ejes-lugar-cartel')!;
  cartel.classList.remove('ejes-lugar-cartel--fuera', 'ejes-lugar-cartel--cae');
  cartel.querySelector('.ejes-lugar-sello')!.textContent = momento.nombre;
  cartel.querySelector('.ejes-lugar-canta')!.textContent = momento.canta;
  if (!cae) return;
  void cartel.offsetWidth;
  cartel.classList.add('ejes-lugar-cartel--cae');
  sonarEfecto('sello');
}

/**
 * Un guiño: lo que aparece en el lugar cuando se contesta la hoja `hoja`, del lado que se
 * tocó (`noche.ts` dice qué y dónde). `cae`: llega como un sello; si no, ya está puesto.
 */
function ponerGuino(hoja: number, lado: 0 | 1, cae: boolean): void {
  const caja = lugar?.querySelector('.ejes-lugar-guinos');
  const dato = GUINOS.porHoja[hoja]?.[lado];
  if (!caja || !dato) return;
  const medida = GUINOS[dato.tipo];
  const pieza = el('i', `ejes-guino ejes-guino--${dato.tipo}`);
  pieza.dataset['hoja'] = String(hoja);
  pieza.style.setProperty('--x', String(dato.x - medida.ancho / 2));
  pieza.style.setProperty('--sube', String(dato.sube));
  pieza.style.setProperty('--ancho', String(medida.ancho));
  pieza.style.setProperty('--alto', String(medida.alto));
  if (cae) pieza.classList.add('ejes-guino--cae');
  caja.append(pieza);
}

function sacarGuino(hoja: number): void {
  lugar?.querySelector(`.ejes-guino[data-hoja="${hoja}"]`)?.remove();
}

/* ------------------------------------------------------------------
   La hoja de la pregunta.
   ------------------------------------------------------------------ */

/**
 * La hoja de antes se va de costado, como una página que se pasa, y la nueva ya estaba abajo.
 * Al volver es al revés: la anterior vuelve desde ese costado y tapa a la que estaba.
 *
 * Con movimiento reducido no hay pase: la hoja vieja se saca y listo.
 */
function pasarHoja(nueva: HTMLElement, pase: Pase): void {
  if (!pila) return;
  const vieja = pila.querySelector<HTMLElement>('.ejes-hoja:not(.ejes-hoja--fantasma)');
  // Un pase que no terminó (dos toques seguidos al volver) no deja hojas colgadas.
  for (const resto of pila.querySelectorAll('.ejes-hoja--fantasma')) resto.remove();
  if (!vieja || pase === 'abre' || duracionDe('--duracion-umbral') <= 0) {
    vieja?.remove();
    pila.append(nueva);
    return;
  }
  // La que se va queda dibujada pero ya no existe para nadie: ni foco, ni lector, ni toque.
  vieja.classList.add('ejes-hoja--fantasma');
  vieja.setAttribute('aria-hidden', 'true');
  vieja.inert = true;
  vieja.querySelector('#ejes-enunciado')?.removeAttribute('id');
  pila.append(nueva);
  const quien = pase === 'vuelve' ? nueva : vieja;
  quien.classList.add(pase === 'vuelve' ? 'ejes-hoja--vuelve' : 'ejes-hoja--se-va');
  quien.addEventListener('animationend', (e) => {
    if (e.target !== quien) return;
    vieja.remove();
    nueva.classList.remove('ejes-hoja--vuelve');
  });
}

/** Corta los relojes de un pase de momento que quedó a medias. */
function cortarRelojes(): void {
  for (const r of relojes) window.clearTimeout(r);
  relojes = [];
}

function pintarPregunta(pase: Pase, antes?: Polo): void {
  const item = ronda[paso]!;
  const momento = momentoDe(item.momento);
  cortarRelojes();
  bloqueado = false;

  const hoja = el('article', 'ejes-hoja');

  const cabeza = el('div', 'ejes-hoja-cabeza');
  const sello = el('p', 'ejes-momento', momento.nombre);
  // Cinco veces por noche, no diez: en la segunda hoja del mismo momento el sello ya está
  // puesto, y re-estamparlo sería ruido.
  const cambio = item.momento !== momentoAnterior;
  if (cambio) sello.classList.add('ejes-momento--entra');
  momentoAnterior = item.momento;
  cabeza.append(sello);
  // Las hojas de la noche (2026-11-04): una casilla por momento, pasada, actual o por venir.
  // Desde la ronda de pulida cada casilla son dos mitades, una por hoja: la que ya se contestó
  // está llena, y la marca de la opción elegida vuela hasta la suya. Solo para el ojo: el
  // folio y el anuncio ya dicen dónde estás.
  const noche = el('ol', 'ejes-noche');
  noche.setAttribute('aria-hidden', 'true');
  const actual = banco.momentos.findIndex((m) => m.id === item.momento);
  let hojaDeLaNoche = 0;
  banco.momentos.forEach((m, k) => {
    const casilla = el('li', 'ejes-noche-hoja');
    if (k < actual) casilla.classList.add('ejes-noche-hoja--pasada');
    if (k === actual) casilla.classList.add('ejes-noche-hoja--actual');
    for (const i of ronda) {
      if (i.momento !== m.id) continue;
      const media = el('i', 'ejes-noche-media');
      if (hojaDeLaNoche < paso) media.classList.add('ejes-noche-media--hecha');
      // La de esta hoja se marca para encontrarla: ahí llega la marca que vuela al elegir.
      if (hojaDeLaNoche === paso) media.dataset['esta'] = '';
      hojaDeLaNoche++;
      casilla.append(media);
    }
    noche.append(casilla);
  });
  cabeza.append(noche);
  cabeza.append(el('p', 'ejes-folio', PARTIDA.folio(paso + 1, ronda.length)));
  hoja.append(cabeza);
  // La línea que canta vive en el cartel del lugar. Acá queda su copia para cuando el lugar no
  // tiene cielo (la ventana petisa y el modo incrustado): `juego.css` muestra una sola de las dos.
  hoja.append(el('p', 'ejes-canta', momento.canta));

  const enunciado = el('h2', 'ejes-enunciado', item.enunciado);
  enunciado.id = 'ejes-enunciado';
  hoja.append(enunciado);

  const opciones = el('div', 'ejes-opciones');
  opciones.setAttribute('role', 'group');
  opciones.setAttribute('aria-labelledby', enunciado.id);
  item.opciones.forEach((o, k) => {
    const boton = el('button', 'ejes-opcion') as HTMLButtonElement;
    boton.type = 'button';
    boton.dataset['tecla'] = String(k + 1);
    // La casilla: vacía en las dos, igual de pesada en las dos. Se llena en la que se elige.
    const marca = el('span', 'ejes-opcion-marca');
    marca.setAttribute('aria-hidden', 'true');
    boton.append(el('span', 'ejes-opcion-tecla', String(k + 1)), el('span', 'ejes-opcion-texto', o.texto), marca);
    if (antes === o.polo) {
      // Se volvió a esta hoja: la que se había elegido se ve marcada, y se puede cambiar.
      boton.classList.add('ejes-opcion--antes');
      boton.setAttribute('aria-pressed', 'true');
    }
    boton.addEventListener('click', () => elegir(boton, o.polo, k === 0 ? 0 : 1));
    opciones.append(boton);
  });
  hoja.append(opciones);

  pie?.replaceChildren();
  if (paso > 0) {
    // La cinta de regreso del sitio, en chico: no es una salida (`D-54`), vuelve una hoja.
    const anterior = el('button', 'volver ejes-anterior', PARTIDA.anterior) as HTMLButtonElement;
    anterior.type = 'button';
    anterior.addEventListener('click', volverAnterior);
    pie?.append(anterior);
  }
  pie?.append(
    el('p', 'ejes-teclas', PARTIDA.teclas),
    armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosApagar, prender: PARTIDA.ruidosPrender }),
  );

  // El momento y el folio, una vez por hoja; el enunciado no, que ya lo lee el foco.
  anuncio.textContent = PARTIDA.anuncio(momento.nombre, paso + 1, ronda.length);

  const seVa = duracionDe('--duracion-umbral');
  if (!cambio || pase !== 'sigue' || seVa <= 0) {
    // La hoja que sigue en el mismo momento, la primera de la noche y la vuelta atrás: todo
    // junto. El cartel cae solo cuando se llega a un momento, no cuando se vuelve a él.
    caminar(item.momento);
    if (cambio) rotular(momento, pase !== 'vuelve');
    pasarHoja(hoja, pase);
    enfocar(enunciado);
    return;
  }

  /*
   * El pase de momento, en orden (ronda 2): primero se va la hoja, después camina la tira,
   * después cae el cartel del lugar y al final entra la hoja nueva. Cuatro tiempos, uno atrás
   * del otro, todos de tokens. Mientras dura no se puede elegir ni volver: la hoja nueva
   * todavía no llegó. Con movimiento reducido los tiempos valen cero y se cae en la rama de
   * arriba.
   */
  bloqueado = true;
  const camina = duracionDe('--duracion-inercia');
  const cae = duracionDe('--duracion-pasada');
  const cartel = lugar?.querySelector('.ejes-lugar-cartel');
  // 1. La hoja se va, y con ella el cartel del momento que termina.
  hoja.classList.add('ejes-hoja--espera');
  pasarHoja(hoja, 'sigue');
  cartel?.classList.add('ejes-lugar-cartel--fuera');
  // 2. La tira camina.
  relojes.push(window.setTimeout(() => caminar(item.momento), seVa));
  // 3. Cae el cartel del lugar.
  relojes.push(window.setTimeout(() => rotular(momento, true), seVa + camina));
  // 4. Entra la hoja nueva, y recién ahí se puede tocar.
  relojes.push(
    window.setTimeout(() => {
      hoja.classList.remove('ejes-hoja--espera');
      hoja.classList.add('ejes-hoja--entra');
      bloqueado = false;
      enfocar(enunciado);
    }, seVa + camina + cae),
  );
}

function elegir(boton: HTMLButtonElement, polo: Polo, lado: 0 | 1): void {
  if (bloqueado) return;
  bloqueado = true;
  for (const b of zonaPregunta.querySelectorAll<HTMLButtonElement>('.ejes-opcion')) {
    // Inertes, pero sin apagarse y sin perder el foco.
    b.setAttribute('aria-disabled', 'true');
    b.classList.remove('ejes-opcion--antes');
    b.removeAttribute('aria-pressed');
  }
  boton.classList.add('ejes-opcion--elegida');
  boton.setAttribute('aria-pressed', 'true');

  // La respuesta al toque: la casilla de la opción se llena de un sellazo, y un instante
  // después la marca vuela a su mitad en la fila de la noche. Es la misma marca para
  // cualquiera de las dos: dice que contestaste, no qué.
  const marca = boton.querySelector('.ejes-opcion-marca');
  const media = pila?.querySelector('.ejes-hoja:not(.ejes-hoja--fantasma) .ejes-noche-media[data-esta]');
  estampar(marca);
  sonarEfecto('tecla');
  // Y el lugar responde: algo chico aparece del lado que se tocó (`ponerGuino`).
  sacarGuino(paso);
  lados[paso] = lado;
  ponerGuino(paso, lado, true);
  if (marca && media) {
    window.setTimeout(() => {
      if (!marca.isConnected || !media.isConnected) return;
      volar('', 'ejes-marca-vuela', marca, media, () => {
        media.classList.add('ejes-noche-media--hecha');
        estampar(media);
      });
    }, duracionDe('--duracion-toque'));
  }

  window.setTimeout(() => {
    elegidos.push(polo);
    paso++;
    if (paso < ronda.length) pintarPregunta('sigue');
    else pintarResultado();
  }, pausa());
}

function volverAnterior(): void {
  if (bloqueado || paso === 0) return;
  paso--;
  const antes = elegidos.pop();
  // El guiño de la hoja a la que se vuelve se queda hasta que se elija de nuevo: lo que se
  // deshace es la respuesta, y la escena la acompaña cuando llega la nueva.
  pintarPregunta('vuelve', antes);
}

/* ------------------------------------------------------------------
   El resultado: la última hoja del libro.
   ------------------------------------------------------------------ */

/** Una de las cuatro maneras de la grilla, con su bajada para leer adentro. */
function manera(c: Cuadrante, tuya: boolean, delAmigo: boolean): HTMLElement {
  const li = el('li', 'ejes-manera');
  if (tuya) li.classList.add('ejes-manera--tuya');
  if (delAmigo) li.classList.add('ejes-manera--suya');
  const detalle = document.createElement('details');
  const resumen = document.createElement('summary');
  const sellos = el('span', 'ejes-manera-sellos');
  if (tuya) sellos.append(el('span', 'ejes-manera-sello', RESULTADO.tuya));
  if (delAmigo) sellos.append(el('span', 'ejes-manera-sello ejes-manera-sello--suya', RESULTADO.suya));
  resumen.append(sellos, el('span', 'ejes-manera-nombre', c.nombre));
  detalle.append(resumen, el('p', 'ejes-manera-nombra', lineaQueNombra(c.luzOscuridad, c.ordenCaos)), el('p', 'ejes-manera-bajada', c.bajada));
  li.append(detalle);
  return li;
}

type Disposicion = ReturnType<typeof disposicion>;

/**
 * El plano se arma cuando se lo llega a ver: los dos ejes se trazan desde el cruce y el
 * recuadro de tu manera cae en su lugar como un sello. Es la marca llegando, no una medida:
 * cae en el medio de su cuadrante, igual para todos los que comparten manera (`BR-17`).
 *
 * Mientras no se vio, espera con el recuadro escondido. Sin observador, o con movimiento
 * reducido, no espera nada: el plano está entero desde el principio.
 */
function armarAlVerlo(dibujo: HTMLElement): void {
  if (typeof IntersectionObserver !== 'function' || duracionDe('--duracion-umbral') <= 0) return;
  dibujo.classList.add('ejes-plano--espera');
  const mirada = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      mirada.disconnect();
      dibujo.classList.remove('ejes-plano--espera');
      dibujo.classList.add('ejes-plano--armado');
      // El ruido del sello, cuando el sello cae: después de los dos ejes.
      window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-umbral') * 2);
    },
    { threshold: 0.6 },
  );
  mirada.observe(dibujo);
}

/** Un extremo de un eje: el polo en la rotulada y, debajo, sus palabras. */
function polo(p: Polo, lugar: 'arriba' | 'abajo' | 'izquierda' | 'derecha'): HTMLElement {
  const caja = el('div', `ejes-plano-polo ejes-plano-polo--${lugar}`);
  caja.append(el('span', 'ejes-plano-polo-eje', EJES[p]), el('span', 'ejes-plano-polo-dice', POLOS[p]));
  return caja;
}

/**
 * El plano de dos ejes (`UX-38`, a pedido del usuario: *"queda lindo ver que está en un plano
 * de dos ejes"*). Un recorte de papel con los dos ejes en cruz, los cuatro extremos con su
 * polo y las cuatro maneras, la tuya marcada.
 *
 * **Fijo, como el rombo viejo** (`D-62` enmienda 3, la eligió el usuario): Luz arriba, Orden a
 * la izquierda, el mismo dibujo para todos. Sale de `planoFijo()`, no de una tabla propia; la
 * grilla de abajo sigue relativa, con la tuya primero, porque es la lista para leer.
 *
 * **Sin punto:** la marca es el borde y el sello, como en la grilla. Un punto invita a medir a
 * qué distancia queda del eje, y `resolverCuadrante` no devuelve ningún número (`BR-17`).
 *
 * **Para el lector de pantalla es una imagen con su texto** (`role="img"`), como era el rombo:
 * la grilla dice las cuatro maneras, pero no que hay dos ejes ni dónde cae la tuya. Adentro no
 * hay nada que se toque.
 */
function plano(id: string): HTMLElement {
  const { celdas, renglones, columnas } = planoFijo(banco);
  const recorte = el('div', 'ejes-plano');
  recorte.setAttribute('role', 'img');
  recorte.setAttribute('aria-label', textoDelPlano(banco, id, suyo?.id));

  const cruz = el('div', 'ejes-plano-cruz');
  // Los dos ejes son elementos vacíos con borde, no con fondo: en el contraste forzado el
  // navegador pisa los fondos y respeta los bordes (`UX-38` §4.4).
  cruz.append(el('span', 'ejes-plano-eje ejes-plano-eje--vertical'), el('span', 'ejes-plano-eje ejes-plano-eje--horizontal'));
  celdas.forEach((c, n) => {
    const tuya = c.id === id;
    const delAmigo = c.id === suyo?.id;
    const cuadrante = el('div', `ejes-plano-cuadrante ejes-plano-cuadrante--${n < 2 ? 'arriba' : 'abajo'}`);
    if (tuya) cuadrante.classList.add('ejes-plano-cuadrante--tuya');
    if (delAmigo) cuadrante.classList.add('ejes-plano-cuadrante--suya');
    if (tuya || delAmigo) {
      const sellos = el('span', 'ejes-plano-sellos');
      if (tuya) sellos.append(el('span', 'ejes-plano-sello', RESULTADO.tuya));
      if (delAmigo) sellos.append(el('span', 'ejes-plano-sello ejes-plano-sello--suya', RESULTADO.suya));
      cuadrante.append(sellos);
    }
    cuadrante.append(el('span', 'ejes-plano-nombre', c.nombre));
    cruz.append(cuadrante);
  });
  cruz.append(polo(columnas[0], 'izquierda'), polo(columnas[1], 'derecha'));

  recorte.append(polo(renglones[0], 'arriba'), cruz, polo(renglones[1], 'abajo'));
  return recorte;
}

/**
 * Las cuatro maneras en la grilla de dos por dos (`D-57` punto 7): la tuya primero, al lado
 * la que comparte tu polo de luz-oscuridad, abajo la que comparte el de orden-caos. Los
 * rótulos de los márgenes son los polos, no las maneras: dicen qué tienen en común.
 */
function grilla(id: string, d: Disposicion): HTMLElement {
  const { celdas, renglones, columnas } = d;
  const seccion = el('section', 'ejes-cuatro');
  const titulo = el('h3', 'ejes-cuatro-titulo', RESULTADO.lasCuatro);
  titulo.id = 'ejes-cuatro-titulo';
  seccion.setAttribute('aria-labelledby', titulo.id);
  seccion.append(titulo, el('p', 'ejes-cuatro-canta', RESULTADO.lasCuatroCanta));

  if (suyo) {
    // El contraste de `CNT-29`: misma forma en los cuatro casos, sin ganar ni perder. Va
    // **entre los botones y la grilla** (`UX-36` §5.4): habla de lo que la grilla muestra —la
    // tuya y la punteada—, y entre la hoja y los botones empujaba "Empezá otra noche" bajo el
    // pliegue. La hoja es de quien juega; lo que dice del otro es un segundo plano.
    const mia = banco.cuadrantes.find((x) => x.id === id)!;
    seccion.append(
      el('p', 'ejes-contraste', CONTRASTE[relacion(banco, id, suyo.id)](suyo.nombre, POLOS[mia.luzOscuridad], POLOS[mia.ordenCaos])),
    );
  }

  // El plano ya no va acá: desde la ronda 2 de la pulida sube, pegado a la última hoja
  // (`pintarResultado`), para que el sello de tu manera caiga a la vista y no bajo el pliegue.
  const tabla = el('div', 'ejes-grilla');
  // Los rótulos de columna van arriba, una vez; los de renglón, encima de cada par. Son
  // `aria-hidden`: cada manera ya dice sus dos polos en palabras adentro de su bajada.
  const cabeza = el('div', 'ejes-grilla-columnas');
  cabeza.setAttribute('aria-hidden', 'true');
  for (const oc of columnas) cabeza.append(el('span', 'ejes-grilla-polo', `${EJES[oc]} · ${POLOS[oc]}`));
  tabla.append(cabeza);

  const lista = el('ul', 'ejes-grilla-lista');
  lista.setAttribute('aria-label', RESULTADO.altGrilla);
  renglones.forEach((lo, r) => {
    const rotulo = el('li', 'ejes-grilla-renglon', `${EJES[lo]} · ${POLOS[lo]}`);
    rotulo.setAttribute('aria-hidden', 'true');
    lista.append(rotulo);
    for (const c of celdas.slice(r * 2, r * 2 + 2)) lista.append(manera(c, c.id === id, c.id === suyo?.id));
  });
  tabla.append(lista);
  seccion.append(tabla);
  return seccion;
}

function pintarResultado(): void {
  const r = resolverCuadrante(banco, elegidos);
  const c = banco.cuadrantes.find((x) => x.id === r.id)!;

  // El lugar no se tira: se muda al resultado, parado donde terminó la noche, y amanece.
  cortarRelojes();
  const amanecer = lugar;
  zonaPregunta.hidden = true;
  zonaPregunta.replaceChildren();
  lugar = pila = pie = null;
  zonaResultado.hidden = false;
  zonaResultado.replaceChildren();
  if (amanecer) {
    amanecer.classList.add('ejes-lugar--amanece');
    amanecer.querySelector('.ejes-lugar-cartel')?.remove();
    zonaResultado.append(amanecer);
    // Un cuadro después, para que el cambio se vea como cambio: la luna baja y sale el alba.
    void amanecer.offsetWidth;
    amanecer.classList.add('ejes-lugar--alba');
  }
  // Al resultado, la región calla: el foco en el nombre ya lo dice.
  anuncio.textContent = '';

  // La tarjeta se pide ya: cuando toquen "Compartí", el archivo tiene que estar en la mano.
  tarjeta = null;
  void fetch(rutaDeTarjeta(r.id))
    .then((res) => (res.ok ? res.blob() : null))
    .then((b) => {
      if (b) tarjeta = new File([b], `${slugDe(r.id)}-${JUEGO}.png`, { type: 'image/png' });
    })
    .catch(() => undefined);

  // La última hoja se apoya, y sobre ella cae el nombre: es el único sellazo grande de la
  // noche. Con movimiento reducido está todo en su lugar desde el primer cuadro.
  const hoja = el('article', 'ejes-hoja ejes-hoja--final jugo-pega');
  // La marca en dos renglones: el sitio en la calcada y el juego debajo (`UX-36` §5.1).
  const marca = el('p', 'ejes-marca');
  marca.append(el('span', 'ejes-marca-sitio', RESULTADO.marca), el('span', 'ejes-marca-juego', PANTALLA_0.titulo));
  hoja.append(marca);
  const esquinero = document.createElement('img');
  esquinero.className = 'ejes-esquinero';
  esquinero.src = rutaDePieza('esquinero');
  esquinero.alt = '';
  esquinero.width = 112;
  esquinero.height = 128;
  hoja.append(esquinero);
  hoja.append(el('p', 'ejes-rotulo', RESULTADO.rotulo));
  const nombre = el('h2', 'ejes-nombre ejes-nombre--cae', r.nombre);
  hoja.append(nombre);
  window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-umbral'));
  hoja.append(el('p', 'ejes-polos', selloDePolos(c.luzOscuridad, c.ordenCaos)));
  hoja.append(el('p', 'ejes-nombra', lineaQueNombra(c.luzOscuridad, c.ordenCaos)));
  hoja.append(el('p', 'ejes-bajada', r.bajada));
  zonaResultado.append(hoja);

  // El plano, pegado a la hoja (`UX-38` lo ponía después de los botones): tu manera se marca
  // sobre el dibujo del juego y no en una lista aparte. Es un dibujo de más: si no se puede
  // armar, la pantalla sigue sin él.
  try {
    const dibujo = plano(r.id);
    zonaResultado.append(dibujo);
    armarAlVerlo(dibujo);
  } catch {
    /* sin plano, nada más cambia */
  }

  const acciones = el('div', 'ejes-acciones jugo-entra');
  acciones.style.setProperty('--orden', '5');
  // Compartir: viaja **la identidad** —la postal de este cuadrante y su tarjeta— y ningún
  // número (`BR-17`). Es el primario de la pantalla.
  const { boton: compartir, salida } = botonCompartir(RESULTADO, () => ({
    texto: RESULTADO.paraCompartir(r.nombre),
    url: `${location.origin}/juegos/${JUEGO}/${slugDe(r.id)}/`,
    archivo: tarjeta,
  }));
  // La tarjeta asoma arriba del botón: lo que vas a mandar, a la vista antes de tocar. Tocarla
  // comparte; el que tiene nombre para el lector de pantalla es el botón.
  const asoma = el('div', 'tarjeta-asoma');
  asoma.setAttribute('aria-hidden', 'true');
  const foto = el('img', 'jugo-pega') as HTMLImageElement;
  foto.alt = '';
  foto.src = rutaDeTarjeta(r.id);
  foto.addEventListener('error', () => asoma.remove());
  asoma.append(foto);
  asoma.addEventListener('click', () => compartir.click());
  acciones.append(asoma, compartir, salida);

  const denuevo = el('button', 'secundario', RESULTADO.denuevo) as HTMLButtonElement;
  denuevo.type = 'button';
  denuevo.addEventListener('click', empezar);
  acciones.append(denuevo);
  zonaResultado.append(acciones);

  zonaResultado.append(grilla(r.id, disposicion(banco, r.id)));

  const bajar = el('a', 'ejes-bajar', RESULTADO.bajar) as HTMLAnchorElement;
  bajar.href = rutaDeTarjeta(r.id);
  bajar.download = `${slugDe(r.id)}-${JUEGO}.png`;
  zonaResultado.append(bajar);

  const salidaArcade = el('p', 'salida-resultado');
  const alArcade = el('a', 'volver', `← ${RESULTADO.volver}`) as HTMLAnchorElement;
  alArcade.href = '/';
  salidaArcade.append(alArcade);
  zonaResultado.append(salidaArcade);

  window.scrollTo({ top: 0 });
  enfocar(nombre);
}

/* ------------------------------------------------------------------
   Empezar, y la pantalla 0.
   ------------------------------------------------------------------ */

function empezar(): void {
  try {
    ronda = sortearPartida(banco, Math.random, vistos);
  } catch {
    // Una celda vacía: el banco que valida `banco.test.ts` no lo permite, pero si pasa, la
    // portada lo dice en una línea seca y el botón sigue ahí (`UX-36` §4.8). Que "Empezá"
    // no haga nada sería un molinete cerrado.
    if (!document.getElementById('ejes-sin-noche')) {
      const aviso = el('p', 'ejes-sin-noche', PANTALLA_0.sinNoche);
      aviso.id = 'ejes-sin-noche';
      aviso.setAttribute('role', 'alert');
      $('#empezar').before(aviso);
    }
    return;
  }
  for (const i of ronda) vistos.add(i.id);
  paso = 0;
  elegidos.length = 0;
  momentoAnterior = undefined;
  lados.length = 0;
  cortarRelojes();
  // Este toque es el gesto que los celulares piden para dejar sonar algo: se despierta la
  // salida acá, y los ruidos de la noche (la tecla, el sello) ya pueden salir.
  void despertarSalida().then(() => sonarEfecto('clac'));
  const tapa = zonaInicio.hidden ? null : zonaInicio.querySelector<HTMLElement>('.ejes-tapa');
  const desde = tapa?.getBoundingClientRect();
  zonaInicio.hidden = true;
  zonaResultado.hidden = true;
  zonaResultado.replaceChildren();
  zonaPregunta.hidden = false;
  lugar = armarLugar();
  pila = el('div', 'ejes-pila');
  pie = el('div', 'ejes-pie-partida');
  zonaPregunta.replaceChildren(lugar, pila, pie);
  window.scrollTo({ top: 0 });
  pintarPregunta('abre');
  if (tapa && desde) abrirElLibro(tapa, desde);
}

/**
 * El libro se abre: la tapa de la portada viaja hasta donde está la primera hoja y gira sobre
 * su lomo hasta ponerse de canto. Es una copia suelta, dibujada donde estaba la tapa; la hoja
 * de verdad ya está abajo desde el primer cuadro, así que nada espera a que termine.
 *
 * Solo `transform`. Con movimiento reducido el sub-paso vale cero y no hay viaje.
 */
function abrirElLibro(tapa: HTMLElement, desde: DOMRect): void {
  const ms = duracionDe('--duracion-umbral');
  const hoja = pila?.querySelector<HTMLElement>('.ejes-hoja');
  if (!hoja || desde.width === 0 || ms <= 0 || typeof tapa.animate !== 'function') return;
  const hasta = hoja.getBoundingClientRect();
  const copia = tapa.cloneNode(true) as HTMLElement;
  copia.classList.remove('jugo-pega', 'jugo-entra');
  copia.classList.add('ejes-tapa--abre');
  copia.setAttribute('aria-hidden', 'true');
  copia.style.left = `${desde.left}px`;
  copia.style.top = `${desde.top}px`;
  copia.style.width = `${desde.width}px`;
  copia.style.height = `${desde.height}px`;
  document.body.append(copia);
  const dx = hasta.left - desde.left;
  const dy = hasta.top - desde.top;
  const sx = hasta.width / desde.width;
  const sy = hasta.height / desde.height;
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  const viaje = copia.animate(
    [
      { transform: 'translate(0, 0) scale(1, 1)' },
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.02, ${sy})` },
    ],
    { duration: ms * 2, easing: curva, fill: 'forwards' },
  );
  const sacar = (): void => copia.remove();
  viaje.addEventListener('finish', sacar, { once: true });
  viaje.addEventListener('cancel', sacar, { once: true });
}

/**
 * 1 y 2 eligen, Retroceso vuelve. Sin modificadores, y solo con la hoja a la vista. **Una
 * tecla sostenida no contesta la siguiente**: sin el corte de `repeat`, mantener apretado el 1
 * pasa los 600 ms de la pausa y responde la hoja que acaba de llegar.
 */
document.addEventListener('keydown', (e) => {
  if (zonaPregunta.hidden || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '1' || e.key === '2') {
    // La hoja que se está yendo sigue dibujada un instante, con sus dos opciones: el teclado
    // elige en la que está, nunca en esa.
    const boton = zonaPregunta.querySelectorAll<HTMLButtonElement>('.ejes-hoja:not(.ejes-hoja--fantasma) .ejes-opcion')[
      Number(e.key) - 1
    ];
    if (boton && !bloqueado) {
      e.preventDefault();
      boton.click();
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    volverAnterior();
  }
});

/**
 * La etiqueta del amigo, la misma que la postal escribe en su HTML (`Tapa.astro`): rótulo,
 * nombre, sello y línea que nombra, sin la bajada. Dos lugares arman la misma etiqueta porque
 * uno es HTML de build y el otro DOM de isla; si cambia una, cambia la otra.
 */
function etiquetaDelAmigo(c: Cuadrante): HTMLElement {
  const etiqueta = el('figcaption', 'ejes-tapa-etiqueta ejes-tapa-etiqueta--amigo');
  etiqueta.append(
    el('span', 'ejes-tapa-rotulo', POSTAL.rotulo),
    el('span', 'ejes-amigo-nombre', c.nombre),
    el('span', 'ejes-polos', selloDePolos(c.luzOscuridad, c.ordenCaos)),
    el('span', 'ejes-amigo-nombra', lineaQueNombra(c.luzOscuridad, c.ordenCaos)),
  );
  return etiqueta;
}

/*
 * Si alguien llegó por un enlace viejo (`?g=dos-ejes&r=CU-n`, sin postal), la tapa le pega la
 * etiqueta del amigo en lugar del índice, como en la postal, y se va el renglón del lugar
 * (`UX-36` §3.3). **No se redirige** a la postal: `ADR-02` punto 6 dice que los enlaces viejos
 * se leen donde están. Y **no se pisa el subtítulo**: ahí está lo que no se pide —saber nada,
 * haber ido—, que es lo que más necesita leer el que llega por el enlace de otro.
 */
if (suyo && !app.dataset['desafio']) {
  zonaInicio.querySelector('.ejes-tapa-etiqueta')?.replaceWith(etiquetaDelAmigo(suyo));
  zonaInicio.querySelector<HTMLElement>('.donde-estas')?.setAttribute('hidden', '');
}

$('#empezar').addEventListener('click', empezar);
