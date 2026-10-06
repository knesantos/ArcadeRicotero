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
} from '../lib/dos-ejes/copy.ts';
import { rutaDeTarjeta, rutaDePieza, slugDe } from '../lib/dos-ejes/arte.ts';
import { leerDesafio } from '../lib/desafio.ts';
import { botonCompartir } from './compartir.ts';

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
function pausa(): number {
  const crudo = getComputedStyle(document.documentElement).getPropertyValue('--pausa-eleccion').trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return 0;
  return crudo.endsWith('ms') ? n : n * 1000;
}

const momentoDe = (id: string) => banco.momentos.find((m) => m.id === id)!;

/* ------------------------------------------------------------------
   La hoja de la pregunta.
   ------------------------------------------------------------------ */

function pintarPregunta(antes?: Polo): void {
  const item = ronda[paso]!;
  const momento = momentoDe(item.momento);
  bloqueado = false;
  zonaPregunta.replaceChildren();

  const hoja = el('article', 'ejes-hoja');

  const cabeza = el('div', 'ejes-hoja-cabeza');
  const sello = el('p', 'ejes-momento', momento.nombre);
  // Cinco veces por noche, no diez: en la segunda hoja del mismo momento el sello ya está
  // puesto, y re-estamparlo sería ruido.
  if (item.momento !== momentoAnterior) sello.classList.add('ejes-momento--entra');
  momentoAnterior = item.momento;
  cabeza.append(sello);
  cabeza.append(el('p', 'ejes-folio', PARTIDA.folio(paso + 1, ronda.length)));
  hoja.append(cabeza);
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
    boton.append(el('span', 'ejes-opcion-tecla', String(k + 1)), el('span', 'ejes-opcion-texto', o.texto));
    if (antes === o.polo) {
      // Se volvió a esta hoja: la que se había elegido se ve marcada, y se puede cambiar.
      boton.classList.add('ejes-opcion--antes');
      boton.setAttribute('aria-pressed', 'true');
    }
    boton.addEventListener('click', () => elegir(boton, o.polo));
    opciones.append(boton);
  });
  hoja.append(opciones);
  zonaPregunta.append(hoja);

  const pie = el('div', 'ejes-pie-partida');
  if (paso > 0) {
    // La cinta de regreso del sitio, en chico: no es una salida (`D-54`), vuelve una hoja.
    const anterior = el('button', 'volver ejes-anterior', PARTIDA.anterior) as HTMLButtonElement;
    anterior.type = 'button';
    anterior.addEventListener('click', volverAnterior);
    pie.append(anterior);
  }
  pie.append(el('p', 'ejes-teclas', PARTIDA.teclas));
  zonaPregunta.append(pie);

  // El momento y el folio, una vez por hoja; el enunciado no, que ya lo lee el foco.
  anuncio.textContent = PARTIDA.anuncio(momento.nombre, paso + 1, ronda.length);
  enfocar(enunciado);
}

function elegir(boton: HTMLButtonElement, polo: Polo): void {
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
  window.setTimeout(() => {
    elegidos.push(polo);
    paso++;
    if (paso < ronda.length) pintarPregunta();
    else pintarResultado();
  }, pausa());
}

function volverAnterior(): void {
  if (bloqueado || paso === 0) return;
  paso--;
  const antes = elegidos.pop();
  pintarPregunta(antes);
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
  const extremo = (p: Polo) => `${EJES[p]}, ${POLOS[p]}`;
  const lugarDe = (buscado: string | undefined) => celdas.findIndex((c) => c.id === buscado);
  const k = lugarDe(id);
  const j = lugarDe(suyo?.id);
  recorte.setAttribute('role', 'img');
  recorte.setAttribute(
    'aria-label',
    RESULTADO.altPlano({
      arriba: extremo(renglones[0]),
      abajo: extremo(renglones[1]),
      izquierda: extremo(columnas[0]),
      derecha: extremo(columnas[1]),
      tuya: { nombre: celdas[k]!.nombre, lugar: RESULTADO.lugares[k]! },
      suya: j < 0 ? undefined : j === k ? 'misma' : { nombre: celdas[j]!.nombre, lugar: RESULTADO.lugares[j]! },
    }),
  );

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

  // El plano va antes que la grilla y después del contraste (`UX-38` §3.1): orienta primero,
  // la grilla lee después. Es un dibujo de más: si no se puede armar, la grilla sigue sola.
  try {
    seccion.append(plano(id));
  } catch {
    /* sin plano, nada más cambia */
  }

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

  zonaPregunta.hidden = true;
  zonaPregunta.replaceChildren();
  zonaResultado.hidden = false;
  zonaResultado.replaceChildren();
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

  const hoja = el('article', 'ejes-hoja ejes-hoja--final');
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
  const nombre = el('h2', 'ejes-nombre', r.nombre);
  hoja.append(nombre);
  hoja.append(el('p', 'ejes-polos', selloDePolos(c.luzOscuridad, c.ordenCaos)));
  hoja.append(el('p', 'ejes-nombra', lineaQueNombra(c.luzOscuridad, c.ordenCaos)));
  hoja.append(el('p', 'ejes-bajada', r.bajada));
  zonaResultado.append(hoja);

  const acciones = el('div', 'ejes-acciones');
  // Compartir: viaja **la identidad** —la postal de este cuadrante y su tarjeta— y ningún
  // número (`BR-17`). Es el primario de la pantalla.
  const { boton: compartir, salida } = botonCompartir(RESULTADO, () => ({
    texto: RESULTADO.paraCompartir(r.nombre),
    url: `${location.origin}/juegos/${JUEGO}/${slugDe(r.id)}/`,
    archivo: tarjeta,
  }));
  acciones.append(compartir, salida);

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
  zonaInicio.hidden = true;
  zonaResultado.hidden = true;
  zonaResultado.replaceChildren();
  zonaPregunta.hidden = false;
  window.scrollTo({ top: 0 });
  pintarPregunta();
}

/**
 * 1 y 2 eligen, Retroceso vuelve. Sin modificadores, y solo con la hoja a la vista. **Una
 * tecla sostenida no contesta la siguiente**: sin el corte de `repeat`, mantener apretado el 1
 * pasa los 600 ms de la pausa y responde la hoja que acaba de llegar.
 */
document.addEventListener('keydown', (e) => {
  if (zonaPregunta.hidden || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '1' || e.key === '2') {
    const boton = zonaPregunta.querySelectorAll<HTMLButtonElement>('.ejes-opcion')[Number(e.key) - 1];
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
